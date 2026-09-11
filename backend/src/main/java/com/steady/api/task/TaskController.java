package com.steady.api.task;

import com.steady.api.student.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;

    public TaskController(TaskRepository taskRepository, StudentRepository studentRepository) {
        this.taskRepository = taskRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Task> list(@RequestParam UUID studentId) {
        studentRepository.ensureExists(studentId);
        return taskRepository.findByStudentId(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody CreateTaskRequest request) {
        studentRepository.ensureExists(request.studentId());
        return taskRepository.create(request);
    }

    @PatchMapping("/{id}/completion")
    public void updateCompletion(@PathVariable UUID id, @RequestParam UUID studentId, @RequestBody CompletionRequest request) {
        if (!taskRepository.updateCompletion(id, studentId, request.completed())) {
            throw new TaskNotFoundException();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, @RequestParam UUID studentId) {
        if (!taskRepository.delete(id, studentId)) {
            throw new TaskNotFoundException();
        }
    }

    public record CompletionRequest(boolean completed) {
    }
}

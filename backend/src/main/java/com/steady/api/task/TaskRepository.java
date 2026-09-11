package com.steady.api.task;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Repository
public class TaskRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Task> taskMapper = (resultSet, rowNum) -> new Task(
            UUID.fromString(resultSet.getString("id")),
            UUID.fromString(resultSet.getString("student_id")),
            resultSet.getString("title"),
            resultSet.getDate("due_date").toLocalDate(),
            resultSet.getInt("estimate_minutes"),
            Priority.valueOf(resultSet.getString("priority")),
            resultSet.getBoolean("completed")
    );

    public TaskRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Task> findByStudentId(UUID studentId) {
        return jdbcTemplate.query(
                "select * from tasks where student_id = ? order by completed, due_date, created_at",
                taskMapper,
                studentId
        );
    }

    public List<Task> findOpenByStudentId(UUID studentId) {
        return jdbcTemplate.query(
                "select * from tasks where student_id = ? and completed = false order by due_date, created_at",
                taskMapper,
                studentId
        );
    }

    public Task create(CreateTaskRequest request) {
        UUID id = UUID.randomUUID();
        jdbcTemplate.update(
                "insert into tasks (id, student_id, title, due_date, estimate_minutes, priority, completed) values (?, ?, ?, ?, ?, ?, false)",
                id,
                request.studentId(),
                request.title().trim(),
                Date.valueOf(request.dueDate()),
                request.estimateMinutes(),
                request.priority().name()
        );
        return new Task(id, request.studentId(), request.title().trim(), request.dueDate(), request.estimateMinutes(), request.priority(), false);
    }

    public boolean updateCompletion(UUID id, UUID studentId, boolean completed) {
        return jdbcTemplate.update(
                "update tasks set completed = ? where id = ? and student_id = ?",
                completed,
                id,
                studentId
        ) == 1;
    }

    public boolean delete(UUID id, UUID studentId) {
        return jdbcTemplate.update("delete from tasks where id = ? and student_id = ?", id, studentId) == 1;
    }
}

package com.steady.api.plan;

import com.steady.api.student.StudentRepository;
import com.steady.api.task.Priority;
import com.steady.api.task.Task;
import com.steady.api.task.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PlanningService {
    private final StudentRepository studentRepository;
    private final TaskRepository taskRepository;
    private final PlanRepository planRepository;
    private final OpenAiPlanningClient openAiPlanningClient;

    public PlanningService(
            StudentRepository studentRepository,
            TaskRepository taskRepository,
            PlanRepository planRepository,
            OpenAiPlanningClient openAiPlanningClient
    ) {
        this.studentRepository = studentRepository;
        this.taskRepository = taskRepository;
        this.planRepository = planRepository;
        this.openAiPlanningClient = openAiPlanningClient;
    }

    public PlanResponse generate(GeneratePlanRequest request) {
        studentRepository.ensureExists(request.studentId());
        planRepository.saveCheckin(request);
        List<Task> openTasks = taskRepository.findOpenByStudentId(request.studentId());
        if (openTasks.isEmpty()) {
            PlanResponse emptyPlan = new PlanResponse(null, "No open tasks", "Choose one small task to add when you are ready.", "You have created some breathing room.", "Take a slow breath and notice the space you made.", false);
            planRepository.savePlan(request, emptyPlan);
            return emptyPlan;
        }

        Task deterministicTask = openTasks.stream().max(Comparator.comparingInt(task -> score(task, request))).orElseThrow();
        Optional<AiPlan> aiPlan = openAiPlanningClient.generate(request, openTasks)
                .filter(plan -> openTasks.stream().anyMatch(task -> task.id().equals(plan.recommendedTaskId())));
        Task recommendedTask = aiPlan
                .flatMap(plan -> openTasks.stream().filter(task -> task.id().equals(plan.recommendedTaskId())).findFirst())
                .orElse(deterministicTask);

        PlanResponse response = aiPlan
                .map(plan -> new PlanResponse(recommendedTask.id(), recommendedTask.title(), plan.starterAction(), plan.encouragement(), plan.resetPrompt(), true))
                .orElseGet(() -> fallbackPlan(recommendedTask, request));
        planRepository.savePlan(request, response);
        return response;
    }

    private PlanResponse fallbackPlan(Task task, GeneratePlanRequest request) {
        String starterAction = "Open “" + task.title() + "” and work only on its first visible step for 25 minutes.";
        String encouragement = request.stressLevel() >= 3
                ? "A small start is enough today. You can reassess after one focus block."
                : "You do not need to finish everything today—just make this next step lighter.";
        String resetPrompt = request.energyLevel() == 1
                ? "Drink water, relax your shoulders, and look away from the screen for one minute."
                : "Take five slow breaths before you begin.";
        return new PlanResponse(task.id(), task.title(), starterAction, encouragement, resetPrompt, false);
    }

    private int score(Task task, GeneratePlanRequest request) {
        long daysUntilDue = ChronoUnit.DAYS.between(LocalDate.now(), task.dueDate());
        int urgency = daysUntilDue <= 0 ? 100 : daysUntilDue == 1 ? 88 : daysUntilDue == 2 ? 74 : daysUntilDue <= 7 ? 56 : 30;
        int priority = switch (task.priority()) {
            case MUST_DO -> 63;
            case IMPORTANT -> 42;
            case NICE_TO_DO -> 21;
        };
        int lowCapacityBonus = (request.stressLevel() >= 3 || request.energyLevel() == 1)
                ? Math.max(0, 35 - task.estimateMinutes() / 3)
                : 0;
        return urgency + priority + lowCapacityBonus;
    }
}

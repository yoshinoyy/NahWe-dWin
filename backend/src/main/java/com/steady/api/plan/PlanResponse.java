package com.steady.api.plan;

import java.util.UUID;

public record PlanResponse(
        UUID recommendedTaskId,
        String recommendedTaskTitle,
        String starterAction,
        String encouragement,
        String resetPrompt,
        boolean usedAi
) {
}

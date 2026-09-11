package com.steady.api.plan;

import java.util.UUID;

public record AiPlan(
        UUID recommendedTaskId,
        String starterAction,
        String encouragement,
        String resetPrompt
) {
}

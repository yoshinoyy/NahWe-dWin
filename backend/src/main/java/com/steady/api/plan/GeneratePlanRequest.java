package com.steady.api.plan;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GeneratePlanRequest(
        @NotNull UUID studentId,
        @Min(1) @Max(4) int stressLevel,
        @Min(1) @Max(3) int energyLevel,
        @Min(15) @Max(720) int capacityMinutes
) {
}

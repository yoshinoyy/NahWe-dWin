package com.steady.api.task;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record CreateTaskRequest(
        @NotNull UUID studentId,
        @NotBlank @Size(max = 160) String title,
        @NotNull LocalDate dueDate,
        @Min(5) @Max(720) int estimateMinutes,
        @NotNull Priority priority
) {
}

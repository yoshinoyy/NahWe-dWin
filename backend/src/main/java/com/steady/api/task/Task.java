package com.steady.api.task;

import java.time.LocalDate;
import java.util.UUID;

public record Task(
        UUID id,
        UUID studentId,
        String title,
        LocalDate dueDate,
        int estimateMinutes,
        Priority priority,
        boolean completed
) {
}

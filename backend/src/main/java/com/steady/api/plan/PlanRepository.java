package com.steady.api.plan;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class PlanRepository {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public PlanRepository(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public void saveCheckin(GeneratePlanRequest request) {
        jdbcTemplate.update(
                "insert into checkins (id, student_id, stress_level, energy_level, capacity_minutes) values (?, ?, ?, ?, ?)",
                UUID.randomUUID(), request.studentId(), request.stressLevel(), request.energyLevel(), request.capacityMinutes()
        );
    }

    public void savePlan(GeneratePlanRequest request, PlanResponse response) {
        try {
            jdbcTemplate.update(
                    "insert into plans (id, student_id, recommended_task_id, response_json, used_ai) values (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), request.studentId(), response.recommendedTaskId(), objectMapper.writeValueAsString(response), response.usedAi()
            );
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not save generated plan", exception);
        }
    }
}

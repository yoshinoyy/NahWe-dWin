package com.steady.api.plan;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steady.api.task.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OpenAiPlanningClient {
    private static final String PLAN_SCHEMA = """
            {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "recommendedTaskId": {"type": "string"},
                "starterAction": {"type": "string"},
                "encouragement": {"type": "string"},
                "resetPrompt": {"type": "string"}
              },
              "required": ["recommendedTaskId", "starterAction", "encouragement", "resetPrompt"]
            }
            """;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final String baseUrl;

    public OpenAiPlanningClient(
            ObjectMapper objectMapper,
            @Value("${steady.openai.api-key}") String apiKey,
            @Value("${steady.openai.model}") String model,
            @Value("${steady.openai.base-url}") String baseUrl
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
    }

    public Optional<AiPlan> generate(GeneratePlanRequest request, List<Task> tasks) {
        if (apiKey == null || apiKey.isBlank()) {
            return Optional.empty();
        }

        try {
            String requestBody = objectMapper.createObjectNode()
                    .put("model", model)
                    .put("store", false)
                    .put("instructions", "You are Steady, a non-clinical student workload planner. Return a calm, practical plan. Never diagnose, shame, or make medical claims. Recommend exactly one supplied task ID. Keep every sentence under 24 words.")
                    .put("input", buildPrompt(request, tasks))
                    .set("text", objectMapper.createObjectNode().set("format", objectMapper.createObjectNode()
                            .put("type", "json_schema")
                            .put("name", "steady_plan")
                            .put("strict", true)
                            .set("schema", objectMapper.readTree(PLAN_SCHEMA))))
                    .toString();

            HttpRequest httpRequest = HttpRequest.newBuilder(URI.create(baseUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();
            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() < 200 || httpResponse.statusCode() >= 300) {
                return Optional.empty();
            }
            return parsePlan(httpResponse.body());
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    private Optional<AiPlan> parsePlan(String responseBody) throws Exception {
        JsonNode response = objectMapper.readTree(responseBody);
        String outputText = response.path("output_text").asText("");
        if (outputText.isBlank()) {
            for (JsonNode output : response.path("output")) {
                for (JsonNode content : output.path("content")) {
                    if ("output_text".equals(content.path("type").asText())) {
                        outputText = content.path("text").asText("");
                        break;
                    }
                }
                if (!outputText.isBlank()) {
                    break;
                }
            }
        }
        if (outputText.isBlank()) {
            return Optional.empty();
        }
        JsonNode plan = objectMapper.readTree(outputText);
        return Optional.of(new AiPlan(
                UUID.fromString(plan.path("recommendedTaskId").asText()),
                plan.path("starterAction").asText(),
                plan.path("encouragement").asText(),
                plan.path("resetPrompt").asText()
        ));
    }

    private String buildPrompt(GeneratePlanRequest request, List<Task> tasks) throws Exception {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Stress level: ").append(request.stressLevel())
                .append("/4. Energy level: ").append(request.energyLevel())
                .append("/3. Capacity today: ").append(request.capacityMinutes()).append(" minutes.\nTasks:\n");
        for (Task task : tasks) {
            prompt.append("- id=").append(task.id())
                    .append(", title=").append(task.title())
                    .append(", due=").append(task.dueDate())
                    .append(", effort=").append(task.estimateMinutes()).append(" minutes")
                    .append(", priority=").append(task.priority()).append("\n");
        }
        prompt.append("Return the JSON object requested by the schema.");
        return prompt.toString();
    }
}

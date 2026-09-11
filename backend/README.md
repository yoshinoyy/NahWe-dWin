# Steady API

Spring Boot API for the Flutter client. It persists tasks and check-ins in Supabase Postgres, then asks OpenAI to return a structured, non-clinical workload plan.

## Local development

The API starts with an in-memory H2 database when Supabase environment variables are absent. This lets the Flutter app exercise task and planning endpoints without a cloud database or API key.

```powershell
cd backend
mvn spring-boot:run
```

Set the variables from `.env.example` before connecting to Supabase or enabling the OpenAI plan generator. Without `OPENAI_API_KEY`, Steady returns the deterministic safe fallback plan.

## API endpoints

- `GET /api/health`
- `GET /api/tasks?studentId=<uuid>`
- `POST /api/tasks`
- `PATCH /api/tasks/<id>/completion?studentId=<uuid>`
- `DELETE /api/tasks/<id>?studentId=<uuid>`
- `POST /api/plans/generate`

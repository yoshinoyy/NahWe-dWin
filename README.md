# Steady

Steady is an AI-powered student stress and workload manager. It turns deadlines, available time, energy, and stress into one realistic next step—without treating productivity as a medical diagnosis.

## Architecture

```text
Flutter app  →  Spring Boot API  →  Supabase Postgres
                    ↓
             OpenAI Responses API
```

- **Frontend:** Flutter dashboard for check-ins, tasks, and AI-generated focus plans.
- **Backend:** Java 21 + Spring Boot REST API. It owns all database and OpenAI requests.
- **Database:** Supabase Postgres for students, tasks, check-ins, and plan history.
- **AI core:** OpenAI Responses API returns structured, non-clinical planning guidance. A deterministic ranking fallback keeps the app useful if AI is unavailable.

## Repository layout

- `frontend/` — Flutter application
- `backend/` — Java Spring Boot API
- `supabase/` — Supabase schema migration and setup guide
- `docs/` — concept brief, presentation, script, and screenshot assets

## Local setup

### 1. Configure Supabase

Create a Supabase project and run the migration in `supabase/migrations/20260911_create_steady_schema.sql`. Follow [supabase/README.md](supabase/README.md) to configure the Java database variables.

### 2. Start the Java API

Copy the names from `backend/.env.example` into your local environment. Do not commit real values.

```powershell
cd backend
mvn spring-boot:run
```

Without Supabase variables, the API uses a local H2 development database. Without `OPENAI_API_KEY`, it safely uses the deterministic planning fallback.

### 3. Start Flutter

```powershell
cd frontend
flutter pub get
flutter run --dart-define=API_BASE_URL=http://localhost:8080/api -d chrome
```

For Android emulators, use `http://10.0.2.2:8080/api` instead. See [frontend/README.md](frontend/README.md) for device-specific notes.

## AI safety

- `OPENAI_API_KEY` stays in the Java service only—never in Flutter or Supabase client configuration.
- The AI receives only current workload inputs necessary to create a plan; no student identifier is sent.
- The prompt instructs it not to diagnose, shame, or make medical claims.
- The backend validates the returned task ID against the student's actual open tasks before using it.

## Presentation

- `docs/Steady-Presentation.pptx` — rubric-aligned presentation deck.
- `docs/Steady-Presentation-Script.md` — approximately 4:20 of narration and demo notes.
- `docs/Steady-Hackathon-Concept.docx` — shareable concept brief.

Rebuild the deck after editing its source:

```powershell
npm install
npm run build:presentation
```

## License

This project is a hackathon prototype. Add a license before public reuse.

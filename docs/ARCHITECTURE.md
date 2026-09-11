# Steady architecture

## Request flow

1. Flutter creates a persistent random student identifier locally.
2. Flutter sends tasks and check-in values to the Spring Boot API.
3. Spring Boot persists the data in Supabase Postgres.
4. The planning service deterministically ranks open tasks by urgency, priority, available capacity, stress, and energy.
5. The service sends only the task context and check-in values to OpenAI.
6. OpenAI returns a JSON plan; the service validates the recommended task ID before returning it to Flutter.
7. If OpenAI or the network is unavailable, the deterministic plan is returned instead.

## Security boundaries

- Flutter: public API base URL and locally-generated student ID only.
- Spring Boot: Supabase database connection and OpenAI API key.
- Supabase: persistent application data; direct public table access is disabled through Row Level Security.

## Deployment targets

- Flutter web: Firebase Hosting, Vercel, Netlify, or GitHub Pages.
- Spring Boot: Railway, Render, Fly.io, or a container host.
- Database: Supabase managed Postgres.

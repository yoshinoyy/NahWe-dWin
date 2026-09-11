# Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `migrations/20260911_create_steady_schema.sql`.
3. In Project Settings → Database, copy the Postgres connection values.
4. Set `SUPABASE_DB_URL`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`, and `SUPABASE_DB_DRIVER=org.postgresql.Driver` for the Java API.

The Flutter client never receives the database password or `OPENAI_API_KEY`. It talks only to the Java API.

Row Level Security is enabled with no public policies because the MVP keeps all database operations on the trusted Java service. Add Supabase Auth and scoped policies before allowing direct client access.

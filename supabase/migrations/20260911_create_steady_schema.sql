create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  due_date date not null,
  estimate_minutes integer not null check (estimate_minutes between 5 and 720),
  priority text not null check (priority in ('NICE_TO_DO', 'IMPORTANT', 'MUST_DO')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tasks_student_due_idx on public.tasks (student_id, completed, due_date);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  stress_level smallint not null check (stress_level between 1 and 4),
  energy_level smallint not null check (energy_level between 1 and 3),
  capacity_minutes integer not null check (capacity_minutes between 15 and 720),
  created_at timestamptz not null default now()
);

create index if not exists checkins_student_created_idx on public.checkins (student_id, created_at desc);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  recommended_task_id uuid references public.tasks(id) on delete set null,
  response_json jsonb not null,
  used_ai boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists plans_student_created_idx on public.plans (student_id, created_at desc);

alter table public.students enable row level security;
alter table public.tasks enable row level security;
alter table public.checkins enable row level security;
alter table public.plans enable row level security;

-- Flutter never accesses these tables directly in the MVP. The Java API owns the
-- database connection, so no public client policy is deliberately created.

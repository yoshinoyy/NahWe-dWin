create table if not exists students (
  id uuid primary key,
  created_at timestamp with time zone default current_timestamp
);

create table if not exists tasks (
  id uuid primary key,
  student_id uuid not null,
  title varchar(160) not null,
  due_date date not null,
  estimate_minutes integer not null,
  priority varchar(16) not null,
  completed boolean not null default false,
  created_at timestamp with time zone default current_timestamp,
  constraint fk_tasks_student foreign key (student_id) references students(id)
);

create table if not exists checkins (
  id uuid primary key,
  student_id uuid not null,
  stress_level integer not null,
  energy_level integer not null,
  capacity_minutes integer not null,
  created_at timestamp with time zone default current_timestamp,
  constraint fk_checkins_student foreign key (student_id) references students(id)
);

create table if not exists plans (
  id uuid primary key,
  student_id uuid not null,
  recommended_task_id uuid,
  response_json clob not null,
  used_ai boolean not null,
  created_at timestamp with time zone default current_timestamp,
  constraint fk_plans_student foreign key (student_id) references students(id)
);

# Database schema reference (public)

## public.profiles

Stores application-level user profile data mapped to `auth.users`.

- id (uuid, PK): references `auth.users.id`
- role (text): must be `teacher` or `student`
- display_name (text, nullable)
- email (text, nullable)
- password (text, nullable) _(exists in table)_
- created_at (timestamp, default `now()`)

Referenced by:

- public.classes.teacher_id
- public.class_members.student_id
- public.submissions.student_id
- public.streaks.student_id

---

## public.classes

Teacher class/group.

- id (uuid, PK, default `gen_random_uuid()`)
- name (text, nullable)
- teacher_id (uuid, nullable): FK → public.profiles.id
- join_code (text, nullable, unique): used for student joining
- created_at (timestamp, default `now()`)

Referenced by:

- public.class_members.class_id
- public.assignments.class_id

---

## public.class_members

Join table linking students to classes.

- id (uuid, PK, default `gen_random_uuid()`)
- class_id (uuid, nullable): FK → public.classes.id
- student_id (uuid, nullable): FK → public.profiles.id

Referenced by:

- public.classes.id
- public.profiles.id

---

## public.assignments

Assignments belonging to a class.

- id (uuid, PK, default `gen_random_uuid()`)
- class_id (uuid, nullable): FK → public.classes.id
- title (text, nullable)
- due_date (timestamp, nullable)
- created_at (timestamp, default `now()`)
- description (text, nullable)
- status (text, nullable)
- updated_at (timestamp, default `now()`)

Referenced by:

- public.assignment_files.assignment_id
- public.assignment_problems.assignment_id
- public.submissions.assignment_id

---

## public.submissions

A student’s submission record for an assignment.

- id (uuid, PK, default `gen_random_uuid()`)
- assignment_id (uuid, nullable): FK → public.assignments.id
- student_id (uuid, nullable): FK → public.profiles.id
- score (numeric, nullable)
- xp_earned (integer, nullable)
- submitted_at (timestamp, default `now()`)

Referenced by:

- public.assignments.id
- public.profiles.id

---

## public.streaks

Tracks a student’s current streak.

- student_id (uuid, PK): FK → public.profiles.id
- current_streak (integer, default 0, nullable)
- last_submission_date (date, nullable)

---

## public.assignment_files

Stores uploaded files linked to an assignment.

- id (uuid, PK, default `gen_random_uuid()`)
- assignment_id (uuid, FK → public.assignments.id)
- file_path (text)
- file_type (text, nullable)
- uploaded_at (timestamptz, default `now()`)

---

## public.assignment_problems

Structured problems extracted from assignment files.

- id (uuid, PK, default `gen_random_uuid()`)
- assignment_id (uuid, FK → public.assignments.id)
- order_index (int, nullable)
- type (text, nullable) _(no check constraint shown)_
- prompt (text, nullable)
- choices (jsonb, nullable)
- answer (jsonb, nullable)
- metadata (jsonb, nullable)
- created_at (timestamptz, default `now()`)

# Steady Presentation Script

Target length: about 4 minutes 20 seconds. The video is intentionally not included; this deck and script cover the required presentation content.

## Slide 1 — The idea (45 seconds)

“Meet Steady, a student stress and workload manager. Students are often not short on effort—they are short on clarity. When assignments, deadlines, and personal responsibilities pile up, a normal to-do list can make the problem feel even bigger.

Steady turns a student’s real deadlines, available time, energy, and stress into one realistic next step for today. The goal is simple: move from ‘I have too much to do’ to ‘I know what to do next.’”

## Slide 2 — What is novel (55 seconds)

“The twist is capacity, not more pressure. Most productivity tools plan an ideal day and ask users to fit themselves into it. Steady starts with the day the student actually has.

There are three important choices here. First, the plan is capacity-aware: it respects the time available instead of promising to finish everything. Second, it is stress-responsive: when stress is high or energy is low, the recommendation becomes smaller and a reset appears. Third, it is privacy-first: database and OpenAI keys remain on the Java server, and the AI only receives the current workload context it needs.”

## Slide 3 — Prototype demo (65 seconds)

“Here is the prototype flow. First, the student completes a ten-second check-in. They choose stress, energy, and the amount of time they can give. Next, Steady translates the task inbox into a workload snapshot: how many tasks are open, how much effort remains, and whether the day looks manageable or tight.

Then the focus card chooses one useful next task based on deadline, importance, effort, and capacity. If I set stress to high, Steady shifts toward a smaller action instead of adding pressure. Finally, the student can start a 25-minute focus session, complete the task, and see the plan update. Every screen is designed to make starting easier.”

## Slide 4 — Technology and build plan (50 seconds)

“The MVP has a focused production-style stack. Flutter creates the responsive student experience. A Java Spring Boot API owns task operations and the AI call. Supabase Postgres keeps tasks, check-ins, and plan history. The OpenAI key stays in the backend, never in the client.

In week one, we ship the foundation: Flutter UI, Java endpoints, and the Supabase schema. In week two, we add the intelligence: OpenAI planning, output validation, task breakdown, and the weekly view. In week three, we focus on trust and launch: accessibility, private progress insights, user testing, deployment, and the final demo.”

## Slide 5 — Impact and close (45 seconds)

“The change for the user is concrete. Before Steady, they have a scattered list and no clear starting point. After Steady, they have one prioritized task sized to their capacity. Over time, that becomes a repeatable rhythm of focus, reset, and progress.

Our impact hypothesis is that when students see one realistic next action, they start sooner and carry less decision overload. Steady is not a medical tool and it does not diagnose stress. It is a small, private productivity intervention that helps a student begin. Start small. Stay steady.”

## Demo preparation

- Open the dashboard with the seeded sample tasks.
- Set stress to High and energy to Low.
- Point out the workload status and the smaller focus recommendation.
- Start the 25-minute session, then mark the task complete.
- Show the updated task count and demonstrate the reset prompt.

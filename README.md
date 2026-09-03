# Steady

Steady is a calm, student-focused stress and workload manager. It turns a student's deadlines, available time, energy, and stress level into one realistic next action for today.

## Why it exists

Students often do not need another giant to-do list. They need help deciding what matters now without feeling punished by an unrealistic plan. Steady combines a quick, non-clinical check-in with capacity-aware task planning.

## Features

- Quick stress, energy, and time-available check-in
- Task inbox with deadlines, priority, and estimated effort
- Workload snapshot showing open work versus today's capacity
- Focus recommendation with a 25-minute starter session
- Short reset toolkit for breathing, water, stretching, or a screen break
- Local browser persistence with no account or external API required
- Shareable hackathon concept document generated with `export_docx.py`

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000` in a browser.

## Generate the project brief

After installing the dependencies, run:

```powershell
python export_docx.py
```

The output is written to `docs/Steady-Hackathon-Concept.docx`.

## Hackathon demo flow

1. Start with three assignments and two hours available.
2. Set stress to high and energy to low.
3. Show the workload status and the single recommended focus task.
4. Start the 25-minute session, complete the task, and show the updated snapshot.
5. Open the reset toolkit to demonstrate the wellbeing layer.

## Scope and safety

Steady is a productivity prototype, not a medical or mental-health diagnostic tool. It does not infer a diagnosis or replace professional support. Any future production version should include region-specific crisis and campus-support resources.

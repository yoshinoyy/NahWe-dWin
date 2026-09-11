# Steady Flutter app

## Prerequisites

- Flutter stable SDK
- A running Steady Java API

## Run

```powershell
cd frontend
flutter pub get
flutter run --dart-define=API_BASE_URL=http://localhost:8080/api -d chrome
```

For an Android emulator, use `http://10.0.2.2:8080/api`. For a physical device, use your computer's LAN IP and configure `STEADY_ALLOWED_ORIGIN` in the Java API.

The client creates and stores a random local student ID. It never receives a Supabase database password or the OpenAI API key.

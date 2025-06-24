# 💪 QuickFit – 30-Min Home Workout Trainer (PWA)

A simple, mobile-first Progressive Web App for following daily full-body workouts without equipment. Inspired by YouTube workouts like Rowan Row's 30-Minute Full Body Routine.

---

## 🎯 Goal

Help users complete structured, daily 30-minute home workouts including warm-up, main exercises, and cool-down — with optional selfie capture and AI feedback.

---

## 🏗️ Features

### 🏠 Home Screen
- “Start Workout” button
- Daily streak tracker (optional)
- Clean UI with fitness icon

### 🧘 Warm-Up Screen
- 4 warm-up exercises with timers (e.g., 30s–1min)
- Auto-transition to main workout

### 🏋️ Workout Session Screen
- Exercise name + icon/animation
- time displayed
- Auto or manual next button
- Sound countdown option

### 🧘 Cool-Down Screen
- Guided cooldown stretches with timer

### 📸 Post-Workout Selfie
- Take a picture after each workout
- Store images locally (IndexedDB)
- Optional AI pose/form feedback

### 🖼️ Progress Gallery
- View all past workout selfies
- Optional photo comparison

### ⚙️ Settings (Optional)
- Toggle sounds
- Light/Dark mode
- Workout reminder toggle

---

## 🧩 App Flow

---

## 🏃 Example Workout Flow

```json
{
  "workoutName": "30 Min Full Body No-Equipment",
  "warmUp": [
    {"name": "Neck pulses", "duration": "30s"},
    {"name": "Neck rotations", "duration": "30s"},
    {"name": "Shoulder rotations", "duration": "30s"},
    {"name": "Arnold rotations", "duration": "30s"},
    {"name": "Chest expansion(Lateral)", "duration": "30s"},
    {"name": "Chest expansion(Front)", "duration": "30s"},
    {"name": "Hip rotations", "duration": "30s"},
    {"name": "Side to side arm extensions", "duration": "30s"},
    {"name": "Lower back & Hamstrings", "duration": "30s"},
    {"name": "Side lunge pulse", "duration": "30s"},
    {"name": "Knee to chest", "duration": "30s"},
    {"name": "Squat rotations reach tee sky", "duration": "30s"},
  ],
  "exercises": [
    {"name": "3 x Push up 3 x Climbers",  "duration": "40s","rest": "15s"},
    {"name": "Pike shoulder tap",  "duration": "40s","rest": "15s"},
    {"name": "REG push up into plank rotation",  "duration": "40s","rest": "15s"},
    {"name": "Reverse snow angels",  "duration": "40s","rest": "15s"},
    {"name": "In and Out push up",  "duration": "40s","rest": "15s"},
    {"name": "Low plank to hight plank",  "duration": "40s","rest": "40s"},
    {"name": "Reverse lunge reach the sky",  "duration": "40s","rest": "15s"},
    {"name": "Pulse squats",  "duration": "40s","rest": "15s"},
    {"name": "Side to side lunge",  "duration": "40s","rest": "15s"},
    {"name": "Glute bridge",  "duration": "40s","rest": "15s"},
    {"name": "Squat walk outs",  "duration": "40s","rest": "15s"},
    {"name": "In an Out squat",  "duration": "40s","rest": "40s"},
    {"name": "Long arm crunches",  "duration": "40s","rest": "15s"},
    {"name": "Plank knee rotation",  "duration": "40s","rest": "15s"},
    {"name": "Heel touches",  "duration": "40s","rest": "15s"},
    {"name": "Oblique crunch (left)",  "duration": "40s","rest": "15s"},
    {"name": "Oblique crunch (right)",  "duration": "40s","rest": "15s"},
    {"name": "Reverse crunch",  "duration": "40s","rest": "40s"},
    {"name": "Burpees",  "duration": "40s","rest": "15s"},
    {"name": "Jumping Jacks",  "duration": "40s","rest": "15s"},
    {"name": "High knees",  "duration": "40s","rest": "15s"},
    {"name": "Criss cross oblique crunch",  "duration": "40s","rest": "15s"},
    {"name": "Butt kicks",  "duration": "40s","rest": "15s"},
    {"name": "MTN climbers",  "duration": "40s","rest": "15s"},
  ]
}

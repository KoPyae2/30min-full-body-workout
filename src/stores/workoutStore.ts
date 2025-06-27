import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WorkoutDay {
  date: string;
  completed: boolean;
  progress?: number; // Track partial progress (percentage completed)
}

export interface Exercise {
  name: string;
  duration: string;
  rest?: string;
  completed?: boolean;
}

export interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

export interface Workout {
  id: string;
  name: string;
  duration: number; // in minutes
  sections: WorkoutSection[];
  startDate?: string; // Date when workout was started
  totalExercises?: number; // Total number of exercises
  completedExercises?: number; // Number of completed exercises
}

interface WorkoutState {
  // User workout history and progress
  workoutHistory: WorkoutDay[];
  currentStreak: number;
  totalWorkouts: number;
  weeklyGoal: number;
  thisWeekCompleted: number;
  totalTimeSpent: number; // in minutes

  // Today's workout data
  currentWorkout: Workout | null;
  activeExerciseIndex: number;
  activeSection: number;
  workoutStarted: boolean;
  workoutCompleted: boolean;
  
  // Available workouts
  availableWorkouts: Workout[];
  
  // Actions
  addWorkoutDay: (day: WorkoutDay) => void;
  completeWorkout: (date: string) => void;
  startWorkout: (workoutId: string) => void;
  completeCurrentExercise: (sectionIndex?: number, exerciseIndex?: number) => void;
  resetWorkout: () => void;
  calculateCurrentStreak: () => void;
  updateWeeklyProgress: () => void;
  savePartialProgress: () => void;
  checkForPastWorkouts: () => void;
}

// Sample workout data - keep this for reference
const sampleWorkout: Workout = {
  id: "full-body-30",
  name: "30 Min Full Body",
  duration: 30,
  sections: [
    {
      title: "Warm Up",
      exercises: [
        { name: "Neck pulses", duration: "30s" },
        { name: "Neck rotations", duration: "30s" },
        { name: "Shoulder rotations", duration: "30s" },
        { name: "Arnold rotations", duration: "30s" },
        { name: "Chest expansion(Lateral)", duration: "30s" },
        { name: "Chest expansion(Front)", duration: "30s" },
        { name: "Hip rotations", duration: "30s" },
        { name: "Side to side arm extensions", duration: "30s" },
        { name: "Lower back & Hamstrings", duration: "30s" },
        { name: "Side lunge pulse", duration: "30s" },
        { name: "Knee to chest", duration: "30s" },
        { name: "Squat rotations reach tee sky", duration: "30s" },
      ]
    },
    {
      title: "Main Workout",
      exercises: [
        { name: "3 x Push up 3 x Climbers", duration: "40s", rest: "15s" },
        { name: "Pike shoulder tap", duration: "40s", rest: "15s" },
        { name: "REG push up into plank rotation", duration: "40s", rest: "15s" },
        { name: "Reverse snow angels", duration: "40s", rest: "15s" },
        { name: "In and Out push up", duration: "40s", rest: "15s" },
        { name: "Low plank to high plank", duration: "40s", rest: "40s" },
        { name: "Reverse lunge reach the sky", duration: "40s", rest: "15s" },
        { name: "Pulse squats", duration: "40s", rest: "15s" },
        { name: "Side to side lunge", duration: "40s", rest: "15s" },
        { name: "Glute bridge", duration: "40s", rest: "15s" },
        { name: "Squat walk outs", duration: "40s", rest: "15s" },
        { name: "In and Out squat", duration: "40s", rest: "40s" },
        { name: "Long arm crunches", duration: "40s", rest: "15s" },
        { name: "Plank knee rotation", duration: "40s", rest: "15s" },
        { name: "Heel touches", duration: "40s", rest: "15s" },
        { name: "Oblique crunch (left)", duration: "40s", rest: "15s" },
        { name: "Oblique crunch (right)", duration: "40s", rest: "15s" },
        { name: "Reverse crunch", duration: "40s", rest: "40s" },
        { name: "Burpees", duration: "40s", rest: "15s" },
        { name: "Jumping Jacks", duration: "40s", rest: "15s" },
        { name: "High knees", duration: "40s", rest: "15s" },
        { name: "Criss cross oblique crunch", duration: "40s", rest: "15s" },
        { name: "Butt kicks", duration: "40s", rest: "15s" },
        { name: "MTN climbers", duration: "40s", rest: "15s" },
      ]
    }
  ]
};

// Count total and completed exercises in a workout
const countExercises = (workout: Workout): { total: number; completed: number } => {
  let total = 0;
  let completed = 0;
  
  workout.sections.forEach(section => {
    total += section.exercises.length;
    section.exercises.forEach(ex => {
      if (ex.completed) completed++;
    });
  });
  
  return { total, completed };
};

// Calculate streak from workout history
const calculateStreak = (history: WorkoutDay[]): number => {
  let streak = 0;
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const workout of sortedHistory) {
    if (workout.completed) streak++;
    else break;
  }
  
  return streak;
};

// Calculate this week's completed workouts
const calculateWeeklyCompleted = (history: WorkoutDay[]): number => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
  startOfWeek.setHours(0, 0, 0, 0);
  
  return history.filter(day => {
    const dayDate = new Date(day.date);
    return day.completed && dayDate >= startOfWeek;
  }).length;
};

// Get today's date as string
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Create the store with persist middleware
export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => {
      return {
        // Empty initial state
        workoutHistory: [],
        currentStreak: 0,
        totalWorkouts: 0,
        weeklyGoal: 5,
        thisWeekCompleted: 0,
        totalTimeSpent: 0,
        
        currentWorkout: null,
        activeExerciseIndex: 0,
        activeSection: 0,
        workoutStarted: false,
        workoutCompleted: false,
        
        // Still include sample workout for functionality
        availableWorkouts: [sampleWorkout],
        
        // Check for past workouts that need to be saved
        checkForPastWorkouts: () => set(state => {
          if (!state.currentWorkout || !state.currentWorkout.startDate) {
            return state;
          }
          
          const today = getTodayString();
          const startDate = state.currentWorkout.startDate;
          
          // If workout was started on a different day and has progress
          if (startDate !== today && state.currentWorkout.completedExercises && state.currentWorkout.completedExercises > 0) {
            const { total, completed } = countExercises(state.currentWorkout);
            
            // Calculate percentage completed
            const progress = Math.round((completed / total) * 100);
            
            // Add to history if not already there
            const exists = state.workoutHistory.some(d => d.date === startDate);
            let newHistory = state.workoutHistory;
            
            if (exists) {
              // Update existing entry
              newHistory = state.workoutHistory.map(d => 
                d.date === startDate 
                  ? { ...d, progress, completed: false } 
                  : d
              );
            } else if (completed > 0) {
              // Add new entry for partial workout
              newHistory = [...state.workoutHistory, { 
                date: startDate, 
                completed: false,
                progress 
              }];
            }
            
            // Reset workout with clean slate
            return {
              workoutHistory: newHistory,
              currentWorkout: null,
              activeExerciseIndex: 0,
              activeSection: 0,
              workoutStarted: false,
              workoutCompleted: false
            };
          }
          
          return state;
        }),
        
        // Save partial progress without completing workout
        savePartialProgress: () => set(state => {
          if (!state.currentWorkout) return state;
          
          const { total, completed } = countExercises(state.currentWorkout);
          const progress = Math.round((completed / total) * 100);
          
          // Update current workout with counts and start date if not set
          const updatedWorkout = { 
            ...state.currentWorkout,
            totalExercises: total,
            completedExercises: completed,
            startDate: state.currentWorkout.startDate || getTodayString()
          };
          
          // Don't modify history for 0% progress
          if (completed === 0) {
            return { currentWorkout: updatedWorkout };
          }
          
          // Current date is either the stored start date or today
          const workoutDate = updatedWorkout.startDate || getTodayString();
          const exists = state.workoutHistory.some(d => d.date === workoutDate);
          
          let newHistory = state.workoutHistory;
          if (exists) {
            // Update existing day entry
            newHistory = state.workoutHistory.map(d => 
              d.date === workoutDate 
                ? { ...d, progress, completed: completed === total }
                : d
            );
          } else {
            // Add new entry with partial progress
            newHistory = [...state.workoutHistory, {
              date: workoutDate,
              completed: completed === total,
              progress
            }];
          }
          
          return {
            currentWorkout: updatedWorkout,
            workoutHistory: newHistory,
          };
        }),
        
        // Actions
        addWorkoutDay: (day) => set((state) => {
          const exists = state.workoutHistory.some(d => d.date === day.date);
          const newHistory = exists 
            ? state.workoutHistory.map(d => d.date === day.date ? day : d)
            : [...state.workoutHistory, day];
            
          return { 
            workoutHistory: newHistory,
            totalWorkouts: newHistory.filter(d => d.completed).length
          };
        }),
        
        completeWorkout: (date) => set((state) => {
          const today = { date, completed: true, progress: 100 };
          const exists = state.workoutHistory.some(d => d.date === date);
          const newHistory = exists 
            ? state.workoutHistory.map(d => d.date === date ? today : d)
            : [...state.workoutHistory, today];
            
          return { 
            workoutHistory: newHistory,
            workoutCompleted: true,
            totalWorkouts: state.totalWorkouts + 1,
            thisWeekCompleted: state.thisWeekCompleted + 1,
            totalTimeSpent: state.totalTimeSpent + (state.currentWorkout?.duration || 30)
          };
        }),
        
        startWorkout: (workoutId) => set((state) => {
          // Check for past incomplete workouts first
          if (state.currentWorkout) {
            get().checkForPastWorkouts();
          }
          
          // Find workout or use sample
          const workout = state.availableWorkouts.find(w => w.id === workoutId) || sampleWorkout;
          
          // Reset exercise states
          const updatedWorkout: Workout = {
            ...workout,
            startDate: getTodayString(),
            sections: workout.sections.map(section => ({
              ...section,
              exercises: section.exercises.map(exercise => ({
                ...exercise,
                completed: false
              }))
            }))
          };
          
          // Count exercises
          const { total, completed } = countExercises(updatedWorkout);
          updatedWorkout.totalExercises = total;
          updatedWorkout.completedExercises = completed;
          
          return {
            currentWorkout: updatedWorkout,
            activeExerciseIndex: 0,
            activeSection: 0,
            workoutStarted: true,
            workoutCompleted: false
          };
        }),
        
        completeCurrentExercise: (sectionIndex?: number, exerciseIndex?: number) => set((state) => {
          if (!state.currentWorkout) return { ...state };
          
          const workout = { ...state.currentWorkout };
          
          // Use provided indices or active indices from state
          const targetSectionIndex = sectionIndex !== undefined ? sectionIndex : state.activeSection;
          const targetExerciseIndex = exerciseIndex !== undefined ? exerciseIndex : state.activeExerciseIndex;
          
          const currentSection = workout.sections[targetSectionIndex];
          
          // Mark current exercise as completed
          if (currentSection && currentSection.exercises[targetExerciseIndex]) {
            currentSection.exercises[targetExerciseIndex].completed = true;
          }
          
          // Update completed count
          const { total, completed } = countExercises(workout);
          workout.totalExercises = total;
          workout.completedExercises = completed;
          
          // Mark start date if not set
          if (!workout.startDate) {
            workout.startDate = getTodayString();
          }
          
          // Save progress to history
          const progress = Math.round((completed / total) * 100);
          const today = workout.startDate;
          const exists = state.workoutHistory.some(d => d.date === today);
          
          let newHistory = state.workoutHistory;
          if (exists) {
            // Update existing day
            newHistory = state.workoutHistory.map(d => 
              d.date === today 
                ? { ...d, progress, completed: completed === total }
                : d
            );
          } else if (completed > 0) {
            // Add new entry
            newHistory = [...state.workoutHistory, {
              date: today,
              completed: completed === total,
              progress
            }];
          }
          
          // If indices are provided, just mark the exercise as completed without advancing
          if (sectionIndex !== undefined && exerciseIndex !== undefined) {
            return {
              currentWorkout: workout,
              workoutHistory: newHistory
            };
          }
          
          // Otherwise use the standard progression logic
          let nextExerciseIndex = targetExerciseIndex + 1;
          let nextSectionIndex = targetSectionIndex;
          
          if (nextExerciseIndex >= currentSection.exercises.length) {
            nextExerciseIndex = 0;
            nextSectionIndex++;
          }
          
          // Check if workout is completely finished
          const isWorkoutCompleted = nextSectionIndex >= workout.sections.length;
          
          if (isWorkoutCompleted) {
            // Complete the workout
            const today = workout.startDate || getTodayString();
            const workoutDay = { date: today, completed: true, progress: 100 };
            
            // Update history with completed workout
            if (exists) {
              newHistory = state.workoutHistory.map(d => 
                d.date === today ? workoutDay : d
              );
            } else {
              newHistory = [...state.workoutHistory, workoutDay];
            }
                
            return { 
              workoutHistory: newHistory,
              workoutCompleted: true,
              totalWorkouts: state.totalWorkouts + 1,
              thisWeekCompleted: state.thisWeekCompleted + 1,
              totalTimeSpent: state.totalTimeSpent + (state.currentWorkout?.duration || 30),
              currentWorkout: workout
            };
          }
          
          return {
            currentWorkout: workout,
            activeExerciseIndex: nextExerciseIndex,
            activeSection: nextSectionIndex,
            workoutHistory: newHistory
          };
        }),
        
        resetWorkout: () => set({
          currentWorkout: null,
          activeExerciseIndex: 0,
          activeSection: 0,
          workoutStarted: false,
          workoutCompleted: false
        }),
        
        calculateCurrentStreak: () => set((state) => ({
          currentStreak: calculateStreak(state.workoutHistory)
        })),
        
        updateWeeklyProgress: () => set((state) => ({
          thisWeekCompleted: calculateWeeklyCompleted(state.workoutHistory)
        }))
      };
    },
    {
      name: 'workout-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist more state to localStorage
        workoutHistory: state.workoutHistory,
        totalWorkouts: state.totalWorkouts,
        weeklyGoal: state.weeklyGoal,
        thisWeekCompleted: state.thisWeekCompleted,
        totalTimeSpent: state.totalTimeSpent,
        availableWorkouts: state.availableWorkouts,
        // Add these to persist workout progress
        currentWorkout: state.currentWorkout,
        activeExerciseIndex: state.activeExerciseIndex,
        activeSection: state.activeSection,
        workoutStarted: state.workoutStarted,
        workoutCompleted: state.workoutCompleted,
      }),
    }
  )
);

// Helper hook to get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper hook to check if user worked out today
export const useDidWorkoutToday = (): boolean => {
  const workoutHistory = useWorkoutStore(state => state.workoutHistory);
  const today = getTodayDateString();
  return workoutHistory.some(day => day.date === today && day.completed);
};

// Helper hook to get user's current streak
export const useCurrentStreak = (): number => {
  const workoutHistory = useWorkoutStore(state => state.workoutHistory);
  return calculateStreak(workoutHistory);
}; 
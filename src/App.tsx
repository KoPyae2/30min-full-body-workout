import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import WorkoutScreen from './components/WorkoutScreen';
import type { WorkoutDay } from './components/WorkoutCalendar';

// Sample workout data for analytics
const workoutHistory: WorkoutDay[] = [
  { date: '2024-06-20', completed: true },
  { date: '2024-06-21', completed: true },
  { date: '2024-06-22', completed: false },
  { date: '2024-06-23', completed: true },
  { date: '2024-06-24', completed: false }, // today
];

const QuickFitApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const startWorkout = () => {
    setCurrentScreen('workout');
  };

  const goHome = () => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'home') {
    return <HomeScreen onStartWorkout={startWorkout} workoutHistory={workoutHistory} />;
  }

  if (currentScreen === 'workout') {
    return <WorkoutScreen onBack={goHome} />;
  }

  return null;
};

export default QuickFitApp;
import React from 'react';
import { Flame, Play } from 'lucide-react';
import StatsCards from './StatsCards';
import WeeklyProgress from './WeeklyProgress';
import WorkoutCalendar from './WorkoutCalendar';
import type { WorkoutDay } from './WorkoutCalendar';

export interface HomeScreenProps {
  onStartWorkout: () => void;
  workoutHistory: WorkoutDay[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartWorkout, workoutHistory }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">QuickFit</h1>
              <p className="text-gray-600">Your fitness journey</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
              <Flame className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Start Workout Button */}
        <button
          onClick={onStartWorkout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
        >
          <Play className="w-8 h-8" />
          <span className="text-xl">Start Today's Workout</span>
        </button>
        {/* Stats Cards */}
        <StatsCards workoutHistory={workoutHistory} />
        {/* Weekly Progress */}
        <WeeklyProgress />
        {/* Calendar */}
        <WorkoutCalendar workoutHistory={workoutHistory} />
      </div>
    </div>
  );
};

export default HomeScreen; 
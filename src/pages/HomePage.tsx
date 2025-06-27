import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight, Calendar, BarChart, Trophy, ArrowRight } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import WeeklyProgress from '../components/WeeklyProgress';
import WorkoutCalendar from '../components/WorkoutCalendar';
import { useWorkoutStore, useDidWorkoutToday } from '../stores/workoutStore';

const HomePage: React.FC = () => {
  const didWorkoutToday = useDidWorkoutToday();
  const { 
    calculateCurrentStreak,
    updateWeeklyProgress,
    checkForPastWorkouts,
    currentStreak,
    totalWorkouts
  } = useWorkoutStore();
  
  // Update calculations when component mounts
  useEffect(() => {
    // Check for any past workouts that need to be saved to history
    checkForPastWorkouts();
    calculateCurrentStreak();
    updateWeeklyProgress();
  }, [checkForPastWorkouts, calculateCurrentStreak, updateWeeklyProgress]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 pt-10 pb-14 relative">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">QuickFit</h1>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Streak and total workouts */}
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-4xl font-bold">{currentStreak}</div>
              <div className="text-blue-100">Day streak</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div>
              <div className="text-4xl font-bold">{totalWorkouts}</div>
              <div className="text-blue-100">Workouts</div>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-6 right-10 w-20 h-20 rounded-full bg-white/5"></div>
          <div className="absolute bottom-10 right-20 w-12 h-12 rounded-full bg-white/5"></div>
          <div className="absolute top-20 right-32 w-8 h-8 rounded-full bg-white/5"></div>
        </div>
      </div>
      
      {/* Content - Raised card effect */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Start Workout Button - Large and prominent */}
          <div className="mb-8">
            <Link
              to="/workout"
              className={`flex items-center justify-between w-full p-5 rounded-xl shadow-md text-white font-medium transition-all ${
                didWorkoutToday
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
            >
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="text-xl">
                  {didWorkoutToday ? 'Today\'s Workout Complete ✓' : 'Start Today\'s Workout'}
                </span>
              </div>
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
          
          {/* Stats Cards - Already styled in component */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Progress</h2>
            <StatsCards />
          </div>
          
          {/* Weekly Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">This Week</h2>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Weekly Goal
              </div>
            </div>
            <WeeklyProgress />
          </div>
          
          {/* Calendar */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Overview</h2>
            <WorkoutCalendar />
          </div>
          
          {/* Quick actions */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/workout" 
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100"
              >
                <Calendar className="w-6 h-6 text-indigo-600 mb-2" />
                <span className="text-gray-800 font-medium">Workouts</span>
              </Link>
              
              <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <BarChart className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-gray-800 font-medium">Statistics</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-100">
                <Trophy className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-gray-800 font-medium">Achievements</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <ArrowRight className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-gray-800 font-medium">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 px-6 text-center text-gray-500 text-sm">
        <p>QuickFit - Your Daily Fitness Companion</p>
      </div>
    </div>
  );
};

export default HomePage; 
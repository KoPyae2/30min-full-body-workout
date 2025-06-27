import React from 'react';
import { Flame, Award, Target, Clock } from 'lucide-react';
import { useWorkoutStore } from '../stores/workoutStore';

const StatsCards: React.FC = () => {
  const { 
    totalWorkouts,
    currentStreak,
    weeklyGoal,
    thisWeekCompleted,
    totalTimeSpent
  } = useWorkoutStore();
  
  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-500'
    },
    {
      icon: Award,
      label: 'Total Workouts',
      value: totalWorkouts,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-500'
    },
    {
      icon: Target,
      label: 'Weekly Goal',
      value: `${thisWeekCompleted}/${weeklyGoal}`,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-500'
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: `${Math.floor(totalTimeSpent / 60)}h`,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-500'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-5 shadow-sm relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white bg-opacity-60 -mt-6 -mr-6"></div>
          <div className="mb-2">
            <div className={`${stat.iconBg} rounded-full p-2 w-fit`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 
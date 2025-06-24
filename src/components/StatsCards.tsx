import React from 'react';
import { Flame, Award, Target, Clock } from 'lucide-react';

export interface WorkoutDay {
  date: string;
  completed: boolean;
}

export interface StatsCardsProps {
  workoutHistory: WorkoutDay[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ workoutHistory }) => {
  const totalWorkouts = workoutHistory.filter(w => w.completed).length;
  const currentStreak = (() => {
    let streak = 0;
    const sorted = [...workoutHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const workout of sorted) {
      if (workout.completed) streak++;
      else break;
    }
    return streak;
  })();
  const weeklyGoal = 5;
  const thisWeekCompleted = 3; // This would be calculated from actual data
  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Award,
      label: 'Total Workouts',
      value: totalWorkouts,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'Weekly Goal',
      value: `${thisWeekCompleted}/${weeklyGoal}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: `${Math.floor(totalWorkouts * 0.5)}h`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
          <div className={`${stat.bgColor} rounded-lg p-2 w-fit mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 
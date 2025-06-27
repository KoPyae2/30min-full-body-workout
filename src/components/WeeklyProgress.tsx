import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useWorkoutStore } from '../stores/workoutStore';

const WeeklyProgress: React.FC = () => {
  const { workoutHistory, thisWeekCompleted, weeklyGoal } = useWorkoutStore();
  
  // Generate last 7 days for display
  const getLastSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        date: dateStr,
        completed: workoutHistory.some(d => d.date === dateStr && d.completed)
      });
    }
    
    return days;
  };
  
  const weekDays = getLastSevenDays();
  const completionPercentage = Math.round((thisWeekCompleted / weeklyGoal) * 100);
  
  return (
    <>
      <div className="flex justify-between items-end space-x-2">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-full">
              <div 
                className={`h-16 rounded-lg ${day.completed ? 'bg-indigo-600' : 'bg-gray-200'}`}
                style={{ opacity: day.completed ? 1 : 0.5 }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-500">{day.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-800">{thisWeekCompleted}/{weeklyGoal} days</span>
          <p className="text-sm text-gray-500">completed this week</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium text-sm flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {completionPercentage}%
        </div>
      </div>
    </>
  );
};

export default WeeklyProgress; 
import React from 'react';
import { Calendar } from 'lucide-react';

export interface WorkoutDay {
  date: string;
  completed: boolean;
}

export interface WorkoutCalendarProps {
  workoutHistory: WorkoutDay[];
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ workoutHistory }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Create array of days
  const days = [] as (null | {
    day: number;
    date: string;
    completed: boolean;
    hasWorkout: boolean;
    isToday: boolean;
  })[];
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workoutDay = workoutHistory.find(w => w.date === dateStr);
    const isToday = day === today.getDate();
    days.push({
      day,
      date: dateStr,
      completed: workoutDay?.completed || false,
      hasWorkout: !!workoutDay,
      isToday
    });
  }
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <Calendar className="w-5 h-5 text-gray-500" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square flex items-center justify-center">
            {day ? (
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${day.isToday ? 'bg-indigo-600 text-white' : ''}
                ${day.completed ? 'bg-green-100 text-green-800' : ''}
                ${day.hasWorkout && !day.completed ? 'bg-red-100 text-red-800' : ''}
                ${!day.hasWorkout && !day.isToday ? 'text-gray-400' : ''}
              `}>
                {day.day}
              </div>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 rounded-full"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-100 rounded-full"></div>
          <span className="text-gray-600">Missed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCalendar; 
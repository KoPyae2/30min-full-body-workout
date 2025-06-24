import React from 'react';
import { TrendingUp } from 'lucide-react';

const WeeklyProgress: React.FC = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const progress = [true, true, false, true, false, false, false]; // Sample data
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">This Week</h3>
        <TrendingUp className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex justify-between items-end space-x-2">
        {weekDays.map((day, index) => (
          <div key={day} className="flex flex-col items-center space-y-2">
            <div className={`w-8 h-16 rounded-lg flex items-end ${progress[index] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
              <div className={`w-full rounded-lg transition-all duration-300 ${progress[index] ? 'h-full bg-indigo-600' : 'h-2 bg-gray-300'}`}></div>
            </div>
            <span className="text-xs text-gray-600 font-medium">{day}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          3 of 7 days completed this week
        </span>
      </div>
    </div>
  );
};

export default WeeklyProgress; 
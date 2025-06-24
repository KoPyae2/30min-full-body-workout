import React from 'react';
import { ArrowLeft, Clock, Zap, Flame } from 'lucide-react';

export interface WorkoutScreenProps {
  onBack: () => void;
}

const workoutData = {
  "workoutName": "30 Min Full Body",
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
    {"name": "Squat rotations reach tee sky", "duration": "30s"}
  ],
  "exercises": [
    {"name": "3 x Push up 3 x Climbers", "duration": "40s", "rest": "15s"},
    {"name": "Pike shoulder tap", "duration": "40s", "rest": "15s"},
    {"name": "REG push up into plank rotation", "duration": "40s", "rest": "15s"},
    {"name": "Reverse snow angels", "duration": "40s", "rest": "15s"},
    {"name": "In and Out push up", "duration": "40s", "rest": "15s"},
    {"name": "Low plank to high plank", "duration": "40s", "rest": "40s"},
    {"name": "Reverse lunge reach the sky", "duration": "40s", "rest": "15s"},
    {"name": "Pulse squats", "duration": "40s", "rest": "15s"},
    {"name": "Side to side lunge", "duration": "40s", "rest": "15s"},
    {"name": "Glute bridge", "duration": "40s", "rest": "15s"},
    {"name": "Squat walk outs", "duration": "40s", "rest": "15s"},
    {"name": "In and Out squat", "duration": "40s", "rest": "40s"},
    {"name": "Long arm crunches", "duration": "40s", "rest": "15s"},
    {"name": "Plank knee rotation", "duration": "40s", "rest": "15s"},
    {"name": "Heel touches", "duration": "40s", "rest": "15s"},
    {"name": "Oblique crunch (left)", "duration": "40s", "rest": "15s"},
    {"name": "Oblique crunch (right)", "duration": "40s", "rest": "15s"},
    {"name": "Reverse crunch", "duration": "40s", "rest": "40s"},
    {"name": "Burpees", "duration": "40s", "rest": "15s"},
    {"name": "Jumping Jacks", "duration": "40s", "rest": "15s"},
    {"name": "High knees", "duration": "40s", "rest": "15s"},
    {"name": "Criss cross oblique crunch", "duration": "40s", "rest": "15s"},
    {"name": "Butt kicks", "duration": "40s", "rest": "15s"},
    {"name": "MTN climbers", "duration": "40s", "rest": "15s"}
  ]
};

interface Exercise {
  name: string;
  duration: string;
  rest?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isWarmup?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index, isWarmup = false }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${isWarmup ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}
          `}>
            {index + 1}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{exercise.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-600">{exercise.duration}</span>
              </div>
              {exercise.rest && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-orange-500" />
                  <span className="text-sm text-orange-600">Rest {exercise.rest}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WorkoutSectionProps {
  title: string;
  exercises: Exercise[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  isWarmup?: boolean;
}

const WorkoutSection: React.FC<WorkoutSectionProps> = ({ title, exercises, icon: Icon, color, isWarmup = false }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">({exercises.length} exercises)</span>
      </div>
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            index={index}
            isWarmup={isWarmup}
          />
        ))}
      </div>
    </div>
  );
};

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ onBack }) => {
  const totalDuration = () => {
    const warmupTime = workoutData.warmUp.length * 30; // 30s each
    const exerciseTime = workoutData.exercises.length * 40; // 40s each
    const restTime = workoutData.exercises.reduce((total, ex) => total + parseInt(ex.rest), 0);
    return Math.round((warmupTime + exerciseTime + restTime) / 60); // Convert to minutes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-800">
                {workoutData.workoutName}
              </h1>
              <p className="text-sm text-gray-500">~{totalDuration()} minutes</p>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Workout Overview */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Ready to sweat?</h2>
              <p className="text-indigo-100">
                {workoutData.warmUp.length + workoutData.exercises.length} exercises total
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Flame className="w-8 h-8" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{workoutData.warmUp.length}</div>
              <div className="text-sm text-indigo-100">Warm-up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{workoutData.exercises.length}</div>
              <div className="text-sm text-indigo-100">Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalDuration()}</div>
              <div className="text-sm text-indigo-100">Minutes</div>
            </div>
          </div>
        </div>

        {/* Start Workout Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl mb-6 transition-colors duration-200">
          Start Workout Now
        </button>

        {/* Warm-up Section */}
        <WorkoutSection
          title="Warm-up"
          exercises={workoutData.warmUp}
          icon={Zap}
          color="bg-green-500"
          isWarmup={true}
        />

        {/* Main Exercises Section */}
        <WorkoutSection
          title="Main Workout"
          exercises={workoutData.exercises}
          icon={Flame}
          color="bg-indigo-500"
        />
      </div>
    </div>
  );
};

export default WorkoutScreen;
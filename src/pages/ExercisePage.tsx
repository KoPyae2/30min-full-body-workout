import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, XCircle, CheckCircle } from 'lucide-react';
import { useWorkoutStore } from '../stores/workoutStore';

const ExercisePage: React.FC = () => {
  const { sectionId, exerciseId } = useParams<{ sectionId: string; exerciseId: string }>();
  const navigate = useNavigate();
  const { 
    currentWorkout, 
    completeCurrentExercise, 
    savePartialProgress,
    activeSection,
    activeExerciseIndex
  } = useWorkoutStore();
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused by default
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Convert params to numbers
  const currentSectionIndex = parseInt(sectionId || '0', 10);
  const currentExerciseIndex = parseInt(exerciseId || '0', 10);
  
  // Timer reference for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get the current exercise
  const section = currentWorkout?.sections?.[currentSectionIndex];
  const exercise = section?.exercises?.[currentExerciseIndex];
  
  // Parse time (e.g., "30s" -> 30)
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)s/);
    return match ? parseInt(match[1], 10) : 0;
  };
  
  // Setup the timer when the component mounts or exercise changes
  useEffect(() => {
    if (!exercise) return;
    
    // Check if this exercise is already completed
    if (exercise.completed) {
      setIsCompleted(true);
      return;
    }
    
    // Set initial time from exercise duration
    setTimeLeft(parseTime(exercise.duration));
    setIsResting(false);
    setIsPaused(true); // Start paused
    setIsCompleted(false);
    
    // Don't auto-start timer
    
    return () => {
      // Clean up timer when unmounting
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Save any progress when navigating away
      savePartialProgress();
    };
  }, [exercise, savePartialProgress]);
  
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsPaused(false);
    
    // Create new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Timer finished
          clearInterval(timerRef.current as NodeJS.Timeout);
          
          // If we were exercising and there's a rest period, start rest
          if (!isResting && exercise?.rest) {
            setIsResting(true);
            setTimeLeft(parseTime(exercise.rest));
            startTimer(); // Auto-start rest timer
            return 0;
          } else {
            // Exercise complete
            handleComplete();
            return 0;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsPaused(true);
    }
  };
  
  const resetTimer = () => {
    // Stop current timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset to exercise state
    setIsResting(false);
    setIsPaused(true);
    setTimeLeft(parseTime(exercise?.duration || "30s"));
  };
  
  const handleComplete = () => {
    // Mark exercise as completed
    if (exercise && !isCompleted) {
      completeCurrentExercise(currentSectionIndex, currentExerciseIndex);
      setIsCompleted(true);
    }
  };
  
  // Helper function to find the next incomplete exercise
  const findNextIncompleteExercise = (): { sectionIndex: number, exerciseIndex: number } | null => {
    if (!currentWorkout) return null;
    
    // Start searching from the active section and exercise in the workout store
    let nextSectionIndex = activeSection;
    let nextExerciseIndex = activeExerciseIndex;
    
    // If we're on a previous exercise, we should still go to the active one
    if (
      (currentSectionIndex < activeSection) || 
      (currentSectionIndex === activeSection && currentExerciseIndex < activeExerciseIndex)
    ) {
      return { sectionIndex: activeSection, exerciseIndex: activeExerciseIndex };
    }
    
    // Otherwise, find the next incomplete exercise from the current position
    while (nextSectionIndex < currentWorkout.sections.length) {
      const section = currentWorkout.sections[nextSectionIndex];
      
      while (nextExerciseIndex < section.exercises.length) {
        if (!section.exercises[nextExerciseIndex].completed) {
          return { sectionIndex: nextSectionIndex, exerciseIndex: nextExerciseIndex };
        }
        nextExerciseIndex++;
      }
      
      // Move to next section
      nextSectionIndex++;
      nextExerciseIndex = 0;
    }
    
    // If all exercises are completed, return null
    return null;
  };
  
  const handleNext = () => {
    // Make sure current exercise is marked as completed
    if (exercise && !isCompleted) {
      completeCurrentExercise(currentSectionIndex, currentExerciseIndex);
    }
    
    // Find the next incomplete exercise
    const nextExercise = findNextIncompleteExercise();
    
    if (nextExercise) {
      // Navigate to the next incomplete exercise
      navigate(`/exercise/${nextExercise.sectionIndex}/${nextExercise.exerciseIndex}`);
    } else {
      // All exercises are completed, go back to workout page
      navigate('/workout');
    }
  };
  
  const handleBack = () => {
    // Navigate back to workout overview
    navigate('/workout');
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!exercise || !currentWorkout || !section) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold">Exercise not found</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">{exercise.name}</h1>
          <p className="text-gray-500">
            {isResting ? 'Rest' : 'Exercise'} • {isResting ? exercise.rest : exercise.duration}
          </p>
        </div>
      </div>
      
      {/* Timer Circle */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-64 h-64">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke={isResting ? "#f59e0b" : "#10b981"}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={
                2 * Math.PI * 120 * 
                (1 - timeLeft / parseTime(isResting ? exercise.rest || "0s" : exercise.duration))
              }
              transform="rotate(-90 128 128)"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {!isCompleted ? (
              <>
                <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>
                <span className="text-lg text-gray-500 mt-2">
                  {isResting ? "Rest" : "Work"}
                </span>
              </>
            ) : (
              <CheckCircle className="w-20 h-20 text-green-500" />
            )}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-6 mb-8">
        {!isCompleted ? (
          <>
            {isPaused ? (
              <button 
                onClick={startTimer} 
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            ) : (
              <button 
                onClick={pauseTimer} 
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Pause className="w-8 h-8 text-white" />
              </button>
            )}
            <button 
              onClick={resetTimer} 
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
              title="Reset timer"
            >
              <XCircle className="w-8 h-8 text-white" />
            </button>
          </>
        ) : (
          <button 
            onClick={handleNext} 
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg"
          >
            {
              findNextIncompleteExercise() ? "Next Exercise" : "Complete Workout"
            }
          </button>
        )}
      </div>
      
      {/* TEMPORARY: Test Complete Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg flex items-center"
          disabled={isCompleted}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {isCompleted ? "Exercise Completed" : "Complete Exercise (Test)"}
        </button>
      </div>
      
      {/* Exercise info */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <p className="text-gray-700 mb-4">
          Perform the exercise as shown. Focus on proper form and controlled movement.
        </p>
        
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            Exercise {currentExerciseIndex + 1} of {section.exercises.length}
          </div>
          <div>
            Section: {section.title}
          </div>
        </div>
      </div>
      
      {/* TEMPORARY: Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <p><strong>Debug Info:</strong> Section {currentSectionIndex}, Exercise {currentExerciseIndex}</p>
        <p>Completed: {isCompleted ? "Yes" : "No"}</p>
        <p>Active Position: Section {activeSection}, Exercise {activeExerciseIndex}</p>
        {findNextIncompleteExercise() && (
          <p>Next Incomplete: Section {findNextIncompleteExercise()?.sectionIndex}, 
             Exercise {findNextIncompleteExercise()?.exerciseIndex}</p>
        )}
      </div>
    </div>
  );
};

export default ExercisePage; 
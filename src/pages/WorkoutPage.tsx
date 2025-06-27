import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Flame, Dumbbell, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '../stores/workoutStore';

const WorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentWorkout, 
    startWorkout, 
    activeSection,
    activeExerciseIndex,
    workoutCompleted,
    savePartialProgress
  } = useWorkoutStore();

  // If no workout is in progress, start a default one
  useEffect(() => {
    if (!currentWorkout) {
      startWorkout('full-body-30');
    }
  }, [currentWorkout, startWorkout]);

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      savePartialProgress();
    };
  }, [savePartialProgress]);

  // Helper function to check if an exercise is the next one after a completed exercise
  const isNextAfterCompleted = (sectionIndex: number, exerciseIndex: number): boolean => {
    if (!currentWorkout) return false;
    
    // Check if previous exercise in same section is completed
    if (exerciseIndex > 0 && currentWorkout.sections[sectionIndex]?.exercises[exerciseIndex - 1]?.completed) {
      return true;
    }
    
    // Check if last exercise of previous section is completed and this is first exercise of next section
    if (exerciseIndex === 0 && sectionIndex > 0) {
      const prevSection = currentWorkout.sections[sectionIndex - 1];
      const lastExerciseIndex = prevSection?.exercises.length - 1;
      if (lastExerciseIndex >= 0 && prevSection?.exercises[lastExerciseIndex]?.completed) {
        return true;
      }
    }
    
    return false;
  };

  const handleExerciseClick = (sectionIndex: number, exerciseIndex: number) => {
    // Allow navigating to:
    // 1. Completed exercises
    // 2. The current active exercise
    // 3. Previous exercises
    // 4. The next exercise after a completed one
    const canNavigate = 
      (sectionIndex < activeSection) || 
      (sectionIndex === activeSection && exerciseIndex <= activeExerciseIndex) ||
      (sectionIndex === activeSection && exerciseIndex === 0) ||
      (currentWorkout?.sections[sectionIndex]?.exercises[exerciseIndex]?.completed) ||
      isNextAfterCompleted(sectionIndex, exerciseIndex);
      
    if (canNavigate) {
      navigate(`/exercise/${sectionIndex}/${exerciseIndex}`);
    }
  };

  if (!currentWorkout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
            <p className="text-gray-500">Loading workout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = currentWorkout.completedExercises && currentWorkout.totalExercises 
    ? Math.round((currentWorkout.completedExercises / currentWorkout.totalExercises) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 pt-6 pb-10 relative">
          {/* Back button and title */}
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4 bg-white/20 p-2 rounded-full">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-2xl font-bold">{currentWorkout.name}</h1>
            {workoutCompleted && (
              <div className="ml-auto flex items-center bg-green-500 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </div>
            )}
          </div>
          
          {/* Workout stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-100" />
              <div className="text-xl font-bold">{currentWorkout.duration}</div>
              <div className="text-xs text-blue-100">minutes</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Dumbbell className="w-5 h-5 mx-auto mb-1 text-blue-100" />
              <div className="text-xl font-bold">{currentWorkout.totalExercises}</div>
              <div className="text-xs text-blue-100">exercises</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-blue-100" />
              <div className="text-xl font-bold">{progressPercentage}%</div>
              <div className="text-xs text-blue-100">completed</div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-12 right-8 w-16 h-16 rounded-full bg-white/5"></div>
          <div className="absolute bottom-6 right-20 w-10 h-10 rounded-full bg-white/5"></div>
        </div>
      </div>
      
      {/* Content - Raised card effect */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-t-2xl p-6 shadow-lg min-h-screen">
          {/* Workout Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-gray-800">Progress</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {currentWorkout.completedExercises || 0}/{currentWorkout.totalExercises || 0} exercises
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Sections */}
          {currentWorkout.sections.map((section, sectionIndex) => {
            // Count completed exercises in this section
            const totalExercises = section.exercises.length;
            const completedExercises = section.exercises.filter(ex => ex.completed).length;
            const sectionProgress = totalExercises > 0 
              ? Math.round((completedExercises / totalExercises) * 100) 
              : 0;
            
            return (
              <div key={sectionIndex} className="mb-8">
                {/* Section header with progress */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                    <div className="text-sm text-gray-500">{completedExercises} of {totalExercises} completed</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                    <div 
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {sectionProgress}%
                    </div>
                  </div>
                </div>
                
                {/* Exercise cards */}
                <div className="space-y-3">
                  {section.exercises.map((exercise, exerciseIndex) => {
                    // Determine if the exercise is active, completed, or disabled
                    const isActive = sectionIndex === activeSection && exerciseIndex === activeExerciseIndex;
                    const isCompleted = exercise.completed;
                    
                    // Only mark as next up if not already completed
                    const isNextUp = !isCompleted && isNextAfterCompleted(sectionIndex, exerciseIndex);
                    
                    const isDisabled = 
                      !isCompleted && 
                      !isNextUp && 
                      (
                        (sectionIndex > activeSection) || 
                        (sectionIndex === activeSection && exerciseIndex > activeExerciseIndex)
                      );
                    
                    // Determine the appropriate style class based on exercise state
                    let cardStyle = "bg-white border border-gray-100 shadow-sm";
                    let iconBg = "bg-blue-500";
                    
                    if (isCompleted) {
                      cardStyle = "bg-green-50 border border-green-100";
                      iconBg = "bg-green-500";
                    } else if (isActive) {
                      cardStyle = "bg-blue-50 border-2 border-blue-400";
                    } else if (isNextUp) {
                      cardStyle = "bg-yellow-50 border border-yellow-100";
                      iconBg = "bg-yellow-500";
                    }
                    
                    return (
                      <div 
                        key={exerciseIndex}
                        className={`
                          p-4 rounded-xl flex items-center justify-between cursor-pointer
                          ${cardStyle}
                          ${isDisabled ? 'opacity-60' : 'hover:shadow-md transition-shadow'}
                        `}
                        onClick={() => handleExerciseClick(sectionIndex, exerciseIndex)}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3 text-white`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="font-bold">{exerciseIndex + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{exercise.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {exercise.duration} 
                              {exercise.rest && ` + ${exercise.rest} rest`}
                            </div>
                          </div>
                        </div>
                        <div>
                          {isCompleted ? (
                            <div className="text-xs font-medium text-green-600">Completed</div>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage; 
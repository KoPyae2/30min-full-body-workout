import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkoutPage from './pages/WorkoutPage';
import ExercisePage from './pages/ExercisePage';

const QuickFitApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/exercise/:sectionId/:exerciseId" element={<ExercisePage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default QuickFitApp;
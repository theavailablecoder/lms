import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppProviders from './context/AppProviders.jsx';
import PageLoader from './components/shared/PageLoader.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const StudentRegistrationPage = lazy(() => import('./pages/auth/StudentRegistrationPage.jsx'));
const TeacherRegistrationPage = lazy(() => import('./pages/auth/TeacherRegistrationPage.jsx'));
const StudentLayout = lazy(() => import('./pages/student/StudentLayout.jsx'));
const TeacherLayout = lazy(() => import('./pages/teacher/TeacherLayout.jsx'));

export default function App() {
  
  return (
      <BrowserRouter basename="/Orange360Classroom">
    <AppProviders>
      <Suspense fallback={<PageLoader title="Loading your workspace" message="Getting everything ready for you..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/student" element={<StudentRegistrationPage />} />
          <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
          {/* Student Routes */}
          <Route
            path="/student/*"
            element={( 
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            )}
          />
          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={(
              <ProtectedRoute allowedRole="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            )}
          />
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>

    </AppProviders>
      </BrowserRouter>
  );
}

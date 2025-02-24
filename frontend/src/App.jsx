import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import DepartmentPage from './pages/DepartmentPage';
import BookingPage from './pages/BookingPage';

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to homepage if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Homepage />} />

        {/* Protected routes */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DepartmentPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/booking/:deptId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
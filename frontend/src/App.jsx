import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import DepartmentPage from './pages/DepartmentPage';
import BookingPage from './pages/BookingPage';
import HandleBookingPage from './pages/HandleBookingPage';
import StaffView from './pages/StaffView';
import Dashboard from './pages/Dashboard/Dashboard';
import HallReview from './pages/HallReview/Hallreview';
import Requests from './pages/Requests/Requests';
import HallDetails from './pages/HallDetail/HallDetails';
import AddHall from './pages/AddHall/AddHall';
import UpdateHall from './pages/UpdateHall/UpdateHall';
import PendingRequests from './pages/PendingRequests/PendingRequests';
import ApprovedRequests from './pages/ApprovedRequests/ApprovedRequests';
import RejectedRequests from './pages/RejectedRequests/RejectedRequests';
import BookingStatus from './pages/BookingStatus';
import HallBooking from './components/HallBooking';
import BookingConfirmation from './components/BookingConfirmation';
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
        <Route path="/handle-booking/:hallId" element={<HandleBookingPage />} />
        <Route path="/staffview" element={<StaffView />} />
        <Route path="/d" element={<Dashboard />} />
            <Route path="/hall-review" element={<HallReview />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="hall-details/:id" element={<HallDetails />} />
            <Route path="/update-hall/:id" element={<UpdateHall />} />
            <Route path="/add-hall" element={<AddHall />} />
            <Route path="/requests/pending" element={<PendingRequests />} />
            <Route path="/requests/approved" element={<ApprovedRequests />} />
            <Route path="/requests/rejected" element={<RejectedRequests />} />
            <Route path="/bookingstatus" element={<BookingStatus />} />
                    {/* Route to Hall Booking Page */}
        <Route path="/hall" element={<HallBooking />} />

{/* Route to Booking Confirmation Page */}
<Route path="/confirmation" element={<BookingConfirmation />} />


        {/* Catch all route - redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
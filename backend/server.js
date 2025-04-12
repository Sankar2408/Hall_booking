const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const hallRoutes = require('./routes/hallRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookingAvailabilityRoutes = require('./routes/bookingAvailabilityRoutes');
const deptBookingRoutes = require('./routes/deptBookingRoutes'); 
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/halls', hallRoutes); 
app.use('/api/admin-bookings', bookingRoutes);
app.use('/api/halls1', bookingAvailabilityRoutes); // Fixed the route path
app.use('/api/dept-bookings', deptBookingRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



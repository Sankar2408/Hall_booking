const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getUserBookings
} = require('../controllers/bookingController');

// Get all bookings

router.get('/bookings', getAllBookings);


// Get booking by ID
router.get('/:id', getBookingById);

// Create new booking
router.post('/', createBooking);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

// Delete booking
router.delete('/:id', deleteBooking);

router.get('/bookings/user/:userId', getUserBookings);


module.exports = router;
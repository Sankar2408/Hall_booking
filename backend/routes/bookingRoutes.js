const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route to create a new booking
router.post('/', bookingController.createBooking);

// Route to get all bookings (admin panel)
router.get('/', bookingController.getAllBookings);

// Route to get bookings by Hall ID
router.get('/:hallId', bookingController.getBookingsByHallId);

// Route to update booking status (Approve/Reject)
router.put('/:bookingId/status', bookingController.updateBookingStatus);

module.exports = router;

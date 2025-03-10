const db = require('../config/db');

// Controller to handle booking request
exports.createBooking = async (req, res) => {
  const {
    hallId,
    deptId,
    bookingDate,
    timeSlot,
    purpose,
    attendees,
    requesterName,
    requesterEmail,
    requesterPhone,
    additionalNotes
  } = req.body;

  try {
    // Check if the time slot is already booked for that hall
    const [existingBookings] = await db.execute(
      `SELECT * FROM bookings 
       WHERE hallId = ? AND bookingDate = ? AND timeSlot = ?`,
      [hallId, bookingDate, timeSlot]
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({
        message: 'Time slot is already booked for this hall. Please choose another slot.'
      });
    }

    // Insert booking into the database
    await db.execute(
      `INSERT INTO bookings 
      (hallId, deptId, bookingDate, timeSlot, purpose, attendees, 
       requesterName, requesterEmail, requesterPhone, additionalNotes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hallId,
        deptId,
        bookingDate,
        timeSlot,
        purpose,
        attendees,
        requesterName,
        requesterEmail,
        requesterPhone,
        additionalNotes,
        'Pending'
      ]
    );

    return res.status(201).json({
      message: 'Booking request submitted successfully. Pending approval.'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      message: 'Failed to submit booking. Please try again later.'
    });
  }
};

// Controller to get all bookings (for admin panel)
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute('SELECT * FROM bookings');
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      message: 'Failed to fetch bookings. Please try again later.'
    });
  }
};

// Controller to get bookings by Hall ID (for specific hall)
exports.getBookingsByHallId = async (req, res) => {
  const { hallId } = req.params;
  try {
    const [bookings] = await db.execute(
      'SELECT * FROM bookings WHERE hallId = ?',
      [hallId]
    );
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      message: 'Failed to fetch bookings. Please try again later.'
    });
  }
};

// Controller to approve or reject a booking
exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    return res.status(200).json({
      message: `Booking status updated to ${status}.`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({
      message: 'Failed to update booking status. Please try again later.'
    });
  }
};

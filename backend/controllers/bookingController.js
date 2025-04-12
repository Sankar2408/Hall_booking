const pool = require('../config/db');
const { sendBookingConfirmation ,sendAdminNotification,sendStatusUpdate} = require('../utils/emailService');
const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  try {
    let query = `
      SELECT * FROM bookings 
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    // Add status filter if provided
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    const [rows] = await pool.query(query, params);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


// Get all bookings
const getAllBookings = async (req, res) => {
  console.log('GET /bookings endpoint hit');
  console.log('Query params:', req.query);
  console.log('Request URL:', req.originalUrl);
  
  try {
    let query = `SELECT * FROM bookings b `;
    
    const params = [];
    
    // Apply status filter if provided
    if (req.query.status) {
      query += ` WHERE b.status = ?`;
      params.push(req.query.status);
    }
    
    console.log('SQL Query:', query);
    console.log('SQL Params:', params);
    
    const [rows] = await pool.query(query, params);
    console.log('Query result:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


// Get booking by ID
const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT b.*, h.name as hall_name, u.name as user_name 
       FROM bookings b 
       JOIN halls h ON b.hall_id = h.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  const {
    hallId,
    hallName,
    staffName,
    staffEmail,
    staffPhone,
    reason,
    date,
    timeFrom,
    timeTo
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check for existing bookings in the same time slot
    const [conflicts] = await connection.query(
      `SELECT * FROM bookings 
       WHERE hall_id = ? 
       AND date = ? 
       AND ((time_from <= ? AND time_to > ?) 
       OR (time_from < ? AND time_to >= ?)
       OR (time_from >= ? AND time_from < ?))`,
      [hallId, date, timeFrom, timeFrom, timeTo, timeTo, timeFrom, timeTo]
    );

    if (conflicts.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    const [result] = await connection.query(
      `INSERT INTO bookings (
        hall_id, hall_name, staff_name, staff_email, staff_phone,
        reason, date, time_from, time_to, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hallId, hallName, staffName, staffEmail, staffPhone, reason, date, timeFrom, timeTo, 'pending']
    );

    // Send confirmation email
    const emailSent = await sendBookingConfirmation({
      hallId,
      hallName,
      staffName,
      staffEmail,
      staffPhone,
      reason,
      date,
      timeFrom,
      timeTo,
      status: 'pending'
    });

    await connection.commit();


    const adminEmailSent = await sendAdminNotification({
      hallId,
      hallName,
      staffName,
      staffEmail,
      staffPhone,
      reason,
      date,
      timeFrom,
      timeTo,
      status: 'pending'
    });

    await connection.commit();


    res.status(201).json({ 
      id: result.insertId,
      hallId,
      hallName,
      staffName,
      staffEmail,
      staffPhone,
      reason,
      date,
      timeFrom,
      timeTo,
      status: 'pending',
      emailSent,
      adminEmailSent
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Fetch updated booking details for email without any joins
    const [booking] = await connection.query(
      `SELECT * FROM bookings WHERE id = ?`,
      [id]
    );

    if (booking.length > 0) {
      await sendBookingConfirmation({
        ...booking[0],
        status
      });
      await sendStatusUpdate({
        ...booking[0],
        status
      });
    }

    await connection.commit();
    res.json({ id, status });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if booking exists and is in the future
    const [booking] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );

    if (booking.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingDate = new Date(booking[0].date);
    const now = new Date();
    
    if (bookingDate < now) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cannot delete past bookings' });
    }

    const [result] = await connection.query(
      'DELETE FROM bookings WHERE id = ?',
      [id]
    );

    await connection.commit();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getUserBookings

};
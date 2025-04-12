const pool = require('../config/db');

// Get staff details by token
const getStaffDetails = async (req, res) => {
  try {
    const email = req.user.email; // From authentication middleware
    
    const [rows] = await pool.query(
      'SELECT staff_id, email, full_name, department, role FROM staff WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getStaffStats = async (req, res) => {
  try {
    const staffEmail = req.user.email; // Assuming the email is part of the authenticated user's token
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedBookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingBookings
      FROM bookings 
      WHERE staff_email = ?`,
      [staffEmail]
    );
    res.json({
      success: true,
      data: {
        totalBookings: parseInt(stats[0].totalBookings) || 0,
        approvedBookings: parseInt(stats[0].approvedBookings) || 0,
        pendingBookings: parseInt(stats[0].pendingBookings) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching staff statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getStaffDetails,
  getStaffStats
};
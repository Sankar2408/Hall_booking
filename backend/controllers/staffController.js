// controllers/staffController.js
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Get the authenticated staff member's profile
exports.getStaffProfile = async (req, res) => {
  try {
    // The staff ID should be available from the auth middleware
    const staffId = req.user.id;

    // Query to get staff information
    const query = 'SELECT staff_id, email, full_name, department, created_at FROM staff WHERE staff_id = ?';
    
    db.query(query, [staffId], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error retrieving staff profile' 
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Staff member not found' 
        });
      }

      // Return the staff information
      return res.status(200).json({
        success: true,
        data: results[0]
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all staff members (for admin purposes)
exports.getAllStaff = async (req, res) => {
  try {
    // Query to get all staff members (exclude password)
    const query = 'SELECT staff_id, email, full_name, department, created_at FROM staff';
    
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error retrieving staff list' 
        });
      }

      // Return the staff information
      return res.status(200).json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
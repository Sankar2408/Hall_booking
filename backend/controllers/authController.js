const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// 🟢 Staff Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.execute('SELECT * FROM staff WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const staff = rows[0];

    // Check password validity
    const isValidPassword = staff.is_first_login
      ? password === staff.password  // First-time login (password stored in plaintext)
      : await bcrypt.compare(password, staff.password); // Normal login (hashed password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { staffId: staff.staff_id, email: staff.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      isFirstLogin: staff.is_first_login,
      staffId: staff.staff_id
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔵 Reset Password (First-Time Login)
const resetPassword = async (req, res) => {
  try {
    const { staffId, newPassword } = req.body;

    if (!staffId || !newPassword) {
      return res.status(400).json({ message: 'Staff ID and new password are required' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.execute(
      'UPDATE staff SET password = ?, is_first_login = FALSE WHERE staff_id = ?',
      [hashedPassword, staffId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// 🟠 Get Staff Profile
const db = require('../config/db'); // Assuming db.js exports MySQL connection


module.exports = {
  login,
  resetPassword,
};

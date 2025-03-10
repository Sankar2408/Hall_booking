const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Make sure this path is correct
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Once token is verified, fetch the staff info from database for additional validation
    const query = 'SELECT staff_id, email, full_name, department FROM staff WHERE staff_id = ?';
    
    db.query(query, [decoded.id], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
          message: 'Error verifying user' 
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          message: 'User not found' 
        });
      }

      // Add the user object to the request
      req.user = {
        id: results[0].staff_id,
        email: results[0].email,
        fullName: results[0].full_name,
        department: results[0].department
      };

      next();
    });
  });
};

module.exports = authenticateToken;
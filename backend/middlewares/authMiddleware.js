const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Make sure this path is correct
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
    req.user = user;  // Attach the decoded token payload to the request
    next();
  });
};

module.exports = authenticateToken;


module.exports = authenticateToken;
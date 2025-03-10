// Import required modules
const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

// Import authentication middleware
const authenticateToken = require('../middlewares/authMiddleware');

// Define authentication routes
router.post('/login', authController.login);
router.post('/reset-password', authenticateToken, authController.resetPassword);
module.exports = router;

// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get authenticated staff profile
// Protected by auth middleware
router.get('/me', authMiddleware, staffController.getStaffProfile);

// Route to get all staff members (admin only, you can add admin middleware here)
router.get('/', authMiddleware, staffController.getAllStaff);

module.exports = router;
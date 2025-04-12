// In your routes file (e.g., staffRoutes.js or index.js)
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, staffController.getStaffDetails);
router.get('/stats', authMiddleware, staffController.getStaffStats);

module.exports = router;

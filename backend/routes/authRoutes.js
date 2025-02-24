const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/reset-password', authenticateToken, authController.resetPassword);

module.exports = router;

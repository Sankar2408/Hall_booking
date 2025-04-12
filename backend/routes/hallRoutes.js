// routes/hallRoutes.js
const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');

// Get all halls
router.get('/', hallController.getAllHalls);

// Get active halls
router.get('/active', hallController.getActiveHalls);

// Get halls by department
router.get('/department/:deptId', hallController.getHallsByDepartment);

// Get hall by ID
router.get('/:id', hallController.getHallById);

// Check hall availability
router.post('/availability', hallController.checkHallsAvailability);

router.get('/ava', hallController.getAvailableHalls);


// Add a new hall
router.post('/', hallController.createHall);

// Update a hall
router.put('/:id', hallController.updateHall);

// Toggle hall status
router.patch('/status/:id', hallController.toggleHallStatus);

// Delete a hall
router.delete('/:id', hallController.deleteHall);

module.exports = router;
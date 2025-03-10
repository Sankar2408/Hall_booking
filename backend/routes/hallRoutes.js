// routes/hallRoutes.js
// Add this new route to your existing hallRoutes.js file

const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');

// Existing routes
router.get('/', hallController.getAllHalls);
router.get('/active', hallController.getActiveHalls);
router.get('/department/:deptId', hallController.getHallsByDepartment);
router.get('/:id', hallController.getHallById);
router.post('/', hallController.createHall);
router.put('/:id', hallController.updateHall);
router.delete('/:id', hallController.deleteHall);
router.patch('/:id/status', hallController.toggleHallStatus);

// Add new route for checking hall availability
router.post('/availability', hallController.checkHallsAvailability);

module.exports = router;

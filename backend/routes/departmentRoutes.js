// routes/departmentRoutes.js
const express = require('express');
const departmentController = require('../controllers/departmentController');
const router = express.Router();

// GET all departments
router.get('/', departmentController.getAllDepartments);

// GET a specific department
router.get('/:id', departmentController.getDepartmentById);

// POST create a new department
router.post('/', departmentController.createDepartment);

// PUT update a department
router.put('/:id', departmentController.updateDepartment);

// DELETE a department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
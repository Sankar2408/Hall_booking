// controllers/departmentController.js
const pool = require('../config/db');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Departments ORDER BY DeptName');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get a specific department
exports.getDepartmentById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Departments WHERE DeptID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Failed to fetch department details' });
  }
};

// Create a new department
exports.createDepartment = async (req, res) => {
  const { deptName, deptCode } = req.body;
  
  if (!deptName || !deptCode) {
    return res.status(400).json({ error: 'Department name and code are required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO Departments (DeptName, DeptCode) VALUES (?, ?)',
      [deptName, deptCode]
    );
    
    res.status(201).json({
      message: 'Department created successfully',
      departmentId: result.insertId,
      department: {
        id: result.insertId,
        deptName,
        deptCode
      }
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  const { deptName, deptCode } = req.body;
  const departmentId = req.params.id;
  
  if (!deptName || !deptCode) {
    return res.status(400).json({ error: 'Department name and code are required' });
  }
  
  try {
    await pool.query(
      'UPDATE Departments SET DeptName = ?, DeptCode = ? WHERE DeptID = ?',
      [deptName, deptCode, departmentId]
    );
    
    res.json({
      message: 'Department updated successfully',
      department: {
        id: departmentId,
        deptName,
        deptCode
      }
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  const departmentId = req.params.id;
  
  try {
    // Check if there are any halls in this department first
    const [halls] = await pool.query(
      'SELECT COUNT(*) as count FROM Halls WHERE DeptID = ?',
      [departmentId]
    );
    
    if (halls[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with halls. Remove all halls first.' 
      });
    }
    
    await pool.query(
      'DELETE FROM Departments WHERE DeptID = ?',
      [departmentId]
    );
    
    res.json({
      message: 'Department deleted successfully',
      departmentId
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};
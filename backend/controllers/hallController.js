// controllers/hallController.js
const pool = require('../config/db');

// Get all halls
// In hallController.js - getAllHalls method
// In hallController.js - getAllHalls method
exports.getAllHalls = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT h.*, d.DeptName FROM Halls h JOIN Departments d ON h.DeptID = d.DeptID'
    );
    
    // Transform data to match frontend expectations
    const transformedRows = rows.map(hall => ({
      id: hall.HallID,
      name: hall.HallName,  // Changed from Name to HallName based on schema
      location: hall.Location,
      capacity: hall.Capacity,
      projector: hall.HasProjector,  // Changed from Projector to HasProjector
      ac: hall.HasAC,  // Changed from AC to HasAC
      image: hall.ImageURL,  // Changed from Image to ImageURL
      department: hall.DeptName,
      deptId: hall.DeptID,
      activeStatus: hall.ActiveStatus
    }));
    
    res.json(transformedRows);
  } catch (error) {
    console.error('Error fetching halls:', error);
    res.status(500).json({ error: 'Failed to fetch halls' });
  }
};

// Get all active halls
exports.getActiveHalls = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ActiveHallsView');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching active halls:', error);
    res.status(500).json({ error: 'Failed to fetch active halls' });
  }
};

// Get halls by department
exports.getHallsByDepartment = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'CALL GetHallsByDepartment(?)',
      [req.params.deptId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching halls:', error);
    res.status(500).json({ error: 'Failed to fetch halls' });
  }
};

// Get a specific hall
exports.getHallById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT h.*, d.DeptName FROM Halls h JOIN Departments d ON h.DeptID = d.DeptID WHERE h.HallID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hall not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching hall details:', error);
    res.status(500).json({ error: 'Failed to fetch hall details' });
  }
};

// Add a new hall
exports.createHall = async (req, res) => {
  const { name, location, capacity, projector, ac, image, deptId } = req.body;
  
  if (!name || !location || !capacity || !deptId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const [result] = await pool.execute(
      'CALL AddHall(?, ?, ?, ?, ?, ?, ?, @hallId)',
      [name, location, parseInt(capacity), !!projector, !!ac, image || null, parseInt(deptId)]
    );
    
    const [rows] = await pool.query('SELECT @hallId as hallId');
    const hallId = rows[0].hallId;
    
    res.status(201).json({ 
      message: 'Hall added successfully', 
      hallId,
      hall: {
        id: hallId,
        name,
        location,
        capacity: parseInt(capacity),
        projector: !!projector,
        ac: !!ac,
        image: image || null,
        deptId: parseInt(deptId),
        activeStatus: true
      }
    });
  } catch (error) {
    console.error('Error adding hall:', error);
    res.status(500).json({ error: 'Failed to add hall' });
  }
};

// Update a hall
exports.updateHall = async (req, res) => {
  const hallId = req.params.id;
  const { name, location, capacity, projector, ac, image, activeStatus } = req.body;
  
  if (!name || !location || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    await pool.execute(
      'CALL UpdateHall(?, ?, ?, ?, ?, ?, ?, ?)',
      [
        parseInt(hallId),
        name,
        location,
        parseInt(capacity),
        !!projector,
        !!ac,
        image || null,
        activeStatus !== undefined ? !!activeStatus : true
      ]
    );
    
    res.json({ 
      message: 'Hall updated successfully',
      hall: {
        id: hallId,
        name,
        location,
        capacity: parseInt(capacity),
        projector: !!projector,
        ac: !!ac,
        image: image || null,
        activeStatus: activeStatus !== undefined ? !!activeStatus : true
      }
    });
  } catch (error) {
    console.error('Error updating hall:', error);
    res.status(500).json({ error: 'Failed to update hall' });
  }
};
// Check availability of halls for a specific department and timeslot
exports.checkHallsAvailability = async (req, res) => {
  const { deptId, selectedDate, timeSlot } = req.body;

  if (!deptId || !selectedDate || !timeSlot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT h.HallID, h.HallName, h.Location, h.Capacity 
       FROM Halls h 
       JOIN Departments d ON h.DeptID = d.DeptID 
       WHERE h.DeptID = ? 
       AND h.HallID NOT IN (
         SELECT HallID FROM Bookings 
         WHERE BookingDate = ? AND TimeSlot = ?
       )`,
      [deptId, selectedDate, timeSlot]
    );

    // Transform data to match frontend expectations
    const availableHalls = rows.map(hall => ({
      id: hall.HallID,
      name: hall.HallName,
      location: hall.Location,
      capacity: hall.Capacity,
    }));

    res.json(availableHalls);
  } catch (error) {
    console.error('Error checking hall availability:', error);
    res.status(500).json({ error: 'Failed to check hall availability' });
  }
};

// Toggle hall active status
exports.toggleHallStatus = async (req, res) => {
  const hallId = req.params.id;
  const { activeStatus } = req.body;
  
  if (activeStatus === undefined) {
    return res.status(400).json({ error: 'Active status is required' });
  }
  
  try {
    await pool.execute(
      'CALL ToggleHallStatus(?, ?)',
      [parseInt(hallId), !!activeStatus]
    );
    
    res.json({ 
      message: `Hall ${activeStatus ? 'activated' : 'deactivated'} successfully`,
      hallId,
      activeStatus: !!activeStatus
    });
  } catch (error) {
    console.error('Error toggling hall status:', error);
    res.status(500).json({ error: 'Failed to update hall status' });
  }
};

// Delete a hall (soft delete by deactivating)
exports.deleteHall = async (req, res) => {
  const hallId = req.params.id;
  
  try {
    await pool.execute(
      'CALL ToggleHallStatus(?, ?)',
      [parseInt(hallId), false]
    );
    
    res.json({ 
      message: 'Hall deleted successfully',
      hallId
    });
  } catch (error) {
    console.error('Error deleting hall:', error);
    res.status(500).json({ error: 'Failed to delete hall' });
  }
};
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const hallRoutes = require('./routes/hallRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/departments', departmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
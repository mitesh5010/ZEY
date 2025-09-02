const express = require('express');
const Admin = require('../models/admin');
const { signToken } = require('../middleware/auth');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Create initial admin (run this once to create admin user)
router.post('/init-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    const filePath = path.join(__dirname, '../../data/officers.json');
    const officers = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(officers) || officers.length === 0) {
      return res.status(400).json({ error: 'No officer data found' });
    }
    const createdAdmins = await Admin.insertMany(officers);

    res.status(201).json({
      message: 'Admins created successfully',
      count: createdAdmins.length,
      admins: createdAdmins.map(a => ({ id: a._id, username: a.username }))
    });

    // Create admin
    // const admin = await Admin.create(
    //   {
    //   username: 'admin',
    //   password: 'admin123' // Change this in production!
    // }, {
    //   username: 'Mitesh',
    //   password: 'mitesh123'
    // }
    // );

    // res.status(201).json({
    //   message: 'Admin created successfully',
    //   admin: { id: admin._id, username: admin.username }
    // });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ error: 'Server error creating admin' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    // Find admin and include password
    const admin = await Admin.findOne({ username }).select('+password');
    
    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    // Create token
    const token = signToken(admin._id);

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
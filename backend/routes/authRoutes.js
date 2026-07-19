const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt-key-rahasia';

// GET: Temporary Seed Route (Untuk dijalankan dari Vercel)
router.get('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'superadmin' });
    if (adminExists) {
      return res.status(200).json({ message: 'Database sudah ter-seed sebelumnya.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPasswordSuperAdmin = await bcrypt.hash('superadmin123', salt);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', salt);

    const users = [
      { username: 'superadmin', password: hashedPasswordSuperAdmin, role: 'superadmin' },
      { username: 'admin', password: hashedPasswordAdmin, role: 'admin' }
    ];

    await User.insertMany(users);
    res.status(200).json({ message: 'Seed berhasil! Akun superadmin dan admin telah dibuat.' });
  } catch (error) {
    res.status(500).json({ message: 'Seed error', error: error.message });
  }
});

// POST: Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek user ada atau tidak
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;

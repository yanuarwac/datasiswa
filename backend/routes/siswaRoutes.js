const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Siswa = require('../models/Siswa');
const router = express.Router();

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
const upload = multer({ storage: storage });

// POST: Tambah Siswa Baru
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nis, nama, alamat, kelas, jurusan, jenisKelamin, status } = req.body;
    const foto = req.file ? req.file.path : null;

    const newSiswa = new Siswa({
      nis,
      nama,
      alamat,
      kelas,
      jurusan,
      jenisKelamin,
      status,
      foto
    });

    const savedSiswa = await newSiswa.save();
    res.status(201).json(savedSiswa);
  } catch (error) {
    console.error("Error in POST /:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'NIS sudah terdaftar!' });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET: Ambil Semua Siswa
router.get('/', async (req, res) => {
  try {
    const siswaList = await Siswa.find().sort({ createdAt: -1 });
    res.status(200).json(siswaList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

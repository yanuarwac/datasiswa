const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Siswa = require('../models/Siswa');
const router = express.Router();

// Setup Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'data_siswa_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// POST: Tambah Siswa Baru
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nis, nama, alamat, kelas, jurusan, jenisKelamin, status } = req.body;
    // req.file.path dari Cloudinary akan berisi URL gambar asli, bukan path lokal
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

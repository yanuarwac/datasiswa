const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Siswa = require('../models/Siswa');
const { protect, authorize } = require('../middleware/authMiddleware');
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
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
  },
});

const upload = multer({ storage: storage });

// POST: Tambah Siswa Baru (Admin & Superadmin)
router.post('/', protect, authorize('admin', 'superadmin'), upload.single('foto'), async (req, res) => {
  try {
    const { nis, nama, alamat, kelas, jurusan, jenisKelamin, status } = req.body;
    // req.file.path dari Cloudinary akan berisi URL gambar asli, bukan path lokal
    const foto = req.file ? req.file.path : null;

    const newSiswa = new Siswa({
      nis, nama, alamat, kelas, jurusan, jenisKelamin, status, foto
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

// GET: Ambil Semua Siswa (Public/Semua yang bisa akses URL API, tapi di frontend dilindungi)
// Kita buat GET dilindungi juga agar aman
router.get('/', protect, async (req, res) => {
  try {
    const siswaList = await Siswa.find().sort({ createdAt: -1 });
    res.status(200).json(siswaList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Edit Siswa (Admin & Superadmin)
router.put('/:id', protect, authorize('admin', 'superadmin'), upload.single('foto'), async (req, res) => {
  try {
    const { nis, nama, alamat, kelas, jurusan, jenisKelamin, status } = req.body;
    
    const updateData = { nis, nama, alamat, kelas, jurusan, jenisKelamin, status };
    if (req.file) {
      updateData.foto = req.file.path;
    }

    const updatedSiswa = await Siswa.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedSiswa) return res.status(404).json({ message: 'Data tidak ditemukan' });
    
    res.status(200).json(updatedSiswa);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'NIS sudah terdaftar!' });
    }
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Hapus Siswa (Hanya Superadmin)
router.delete('/:id', protect, authorize('superadmin'), async (req, res) => {
  try {
    const deletedSiswa = await Siswa.findByIdAndDelete(req.params.id);
    if (!deletedSiswa) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const siswaSchema = new mongoose.Schema({
  nis: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  kelas: { type: String, enum: ['Kelas 9', 'Kelas 10', 'Kelas 11'], required: true },
  jurusan: { type: String, enum: ['IPA', 'IPS'], required: true },
  jenisKelamin: { type: String, enum: ['Laki-laki', 'Perempuan'], required: true },
  status: { type: String, enum: ['Aktif', 'Tidak Aktif', 'Lulus'], default: 'Aktif' },
  foto: { type: String } // Menyimpan path file foto
}, { timestamps: true });

module.exports = mongoose.model('Siswa', siswaSchema);

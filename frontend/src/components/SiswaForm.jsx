import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const SiswaForm = ({ onSiswaAdded }) => {
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    alamat: '',
    kelas: 'Kelas 9',
    jurusan: 'IPA',
    jenisKelamin: 'Laki-laki',
    status: 'Aktif'
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (foto) {
      data.append('foto', foto);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/siswa', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Data siswa berhasil ditambahkan!');
      setFormData({
        nis: '', nama: '', alamat: '', kelas: 'Kelas 9', jurusan: 'IPA', jenisKelamin: 'Laki-laki', status: 'Aktif'
      });
      setFoto(null);
      e.target.reset(); // reset file input
      if (onSiswaAdded) onSiswaAdded(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2><UserPlus size={24} /> Input Data Siswa</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>NIS</label>
          <input type="text" name="nis" value={formData.nis} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Alamat</label>
          <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="form-control" rows="3" required></textarea>
        </div>
        <div className="form-group">
          <label>Kelas</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="kelas" value="Kelas 9" checked={formData.kelas === 'Kelas 9'} onChange={handleChange} /> Kelas 9
            </label>
            <label className="radio-label">
              <input type="radio" name="kelas" value="Kelas 10" checked={formData.kelas === 'Kelas 10'} onChange={handleChange} /> Kelas 10
            </label>
            <label className="radio-label">
              <input type="radio" name="kelas" value="Kelas 11" checked={formData.kelas === 'Kelas 11'} onChange={handleChange} /> Kelas 11
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Jurusan</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="jurusan" value="IPA" checked={formData.jurusan === 'IPA'} onChange={handleChange} /> IPA
            </label>
            <label className="radio-label">
              <input type="radio" name="jurusan" value="IPS" checked={formData.jurusan === 'IPS'} onChange={handleChange} /> IPS
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Jenis Kelamin</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="jenisKelamin" value="Laki-laki" checked={formData.jenisKelamin === 'Laki-laki'} onChange={handleChange} /> Laki-laki
            </label>
            <label className="radio-label">
              <input type="radio" name="jenisKelamin" value="Perempuan" checked={formData.jenisKelamin === 'Perempuan'} onChange={handleChange} /> Perempuan
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="form-control">
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Lulus">Lulus</option>
          </select>
        </div>
        <div className="form-group">
          <label>Foto Siswa</label>
          <input type="file" name="foto" onChange={handleFileChange} className="form-control" accept="image/*" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </form>
    </div>
  );
};

export default SiswaForm;

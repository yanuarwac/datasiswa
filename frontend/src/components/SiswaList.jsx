import React, { useContext, useState } from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SiswaList = ({ siswaList, onRefresh }) => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        setDeleting(id);
        await axios.delete(`${API_URL}/api/siswa/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (onRefresh) onRefresh();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus data');
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="card">
      <h2><Users size={24} /> Data Siswa</h2>
      {siswaList.length === 0 ? (
        <div className="empty-state">Belum ada data siswa.</div>
      ) : (
        <div className="siswa-list">
          {siswaList.map((siswa) => {
            const statusClass =
              siswa.status === 'Aktif' ? 'status-aktif' :
                siswa.status === 'Lulus' ? 'status-lulus' : 'status-tidak-aktif';

            return (
              <div key={siswa._id} className="siswa-item">
                <img
                  src={
                    siswa.foto 
                      ? (siswa.foto.startsWith('http') ? siswa.foto : `http://localhost:5050/${siswa.foto.replace(/\\/g, '/')}`) 
                      : 'https://via.placeholder.com/64'
                  }
                  alt={siswa.nama}
                  className="siswa-foto"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }}
                />
                <div className="siswa-info" style={{ flex: 1 }}>
                  <h3>{siswa.nama} <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>({siswa.nis})</span></h3>
                  <p>{siswa.kelas} - {siswa.jurusan}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{siswa.jenisKelamin}</p>
                  <p>{siswa.alamat}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span className={`status-badge ${statusClass}`}>
                    {siswa.status}
                  </span>
                  
                  {user && (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => navigate(`/edit/${siswa._id}`, { state: { siswa } })}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      
                      {user.role === 'superadmin' && (
                        <button 
                          className="btn" 
                          style={{ background: 'var(--danger-color)', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleDelete(siswa._id)}
                          disabled={deleting === siswa._id}
                        >
                          <Trash2 size={14} /> {deleting === siswa._id ? '...' : 'Hapus'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SiswaList;

import React from 'react';
import { Users } from 'lucide-react';

const SiswaList = ({ siswaList }) => {
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
                <div className="siswa-info">
                  <h3>{siswa.nama} <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>({siswa.nis})</span></h3>
                  <p>{siswa.kelas} - {siswa.jurusan}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{siswa.jenisKelamin}</p>
                  <p>{siswa.alamat}</p>
                </div>
                <div>
                  <span className={`status-badge ${statusClass}`}>
                    {siswa.status}
                  </span>
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

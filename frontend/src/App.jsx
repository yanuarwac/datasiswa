import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SiswaForm from './components/SiswaForm';
import SiswaList from './components/SiswaList';
import './index.css';

function App() {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/siswa');
      setSiswaList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  const handleSiswaAdded = (newSiswa) => {
    setSiswaList([newSiswa, ...siswaList]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Portal Data Siswa</h1>
        <p>Sistem Informasi Manajemen Data Siswa Berbasis Web</p>
      </header>

      <div className="content-grid">
        <div>
          <SiswaForm onSiswaAdded={handleSiswaAdded} />
        </div>
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</div>
          ) : (
            <SiswaList siswaList={siswaList} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SiswaForm from './components/SiswaForm';
import SiswaList from './components/SiswaList';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Portal Data Siswa</h1>
          <p>Sistem Informasi Manajemen Data Siswa Berbasis Web</p>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LayoutDashboard size={18} /> View Data
            </Link>
            <Link to="/input" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PlusCircle size={18} /> Input Data
            </Link>
            <div style={{ marginLeft: '1rem', textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold' }}>{user.username}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ background: 'var(--danger-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
};

const ViewPage = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/siswa`);
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

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</div>
      ) : (
        <SiswaList siswaList={siswaList} onRefresh={fetchSiswa} />
      )}
    </div>
  );
};

const InputPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <SiswaForm onSiswaAdded={() => {
        // Optionally redirect to view page after short delay, but user wanted warning on input page
        // SiswaForm already handles the success message.
      }} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <ViewPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/input" element={
            <ProtectedRoute>
              <Layout>
                <InputPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <InputPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

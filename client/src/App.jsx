import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkSpace from './pages/WorkSpace';
import DashBoard from './pages/DashBoard';
import Registration from './pages/Registration';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import CalendarPage from './pages/CalendarPage';

// Axios default configuration
axios.defaults.baseURL = 'https://taskly-backend-one.vercel.app';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// Helper function for JWT decoding
const decodeJwt = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT does not have 3 parts');
  }

  const payload = atob(parts[1]);
  return JSON.parse(payload);
};

// Safely retrieve the token and decode it
const token = localStorage.getItem('token');
let userId = null;
if (token) {
  try {
    const decodedToken = decodeJwt(token);
    userId = decodedToken._id;  // Assuming the token contains _id
  } catch (error) {
    console.error('Failed to decode JWT:', error);
  }
}

// PrivateRoute component for protecting authenticated routes
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const App = () => {
  const navigate = useNavigate();

  // Redirect to /app/:userId after login or registration
  const handleRedirect = () => {
    if (userId) {
      navigate(`/app/${userId}`);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {userId && (
          <Route path={`/app/${userId}`} element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
        )}
        <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login onLogin={handleRedirect} />} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;

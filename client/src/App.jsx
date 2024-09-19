import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import WorkSpace from './pages/WorkSpace';
import DashBoard from './pages/DashBoard';
import Registration from './pages/Registration';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import CalendarPage from './pages/CalendarPage';
import jwtDecode from 'jwt-decode';  // Use jwt-decode for simpler JWT decoding

// Axios default configuration
axios.defaults.baseURL = 'https://taskly-backend-one.vercel.app';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// PrivateRoute component for protecting authenticated routes
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const App = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Use useEffect to decode the token and set userId
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Use jwt-decode for simplicity
        setUserId(decodedToken._id);  // Assuming the token contains _id
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        navigate('/login');  // Redirect to login if decoding fails
      }
    } else {
      navigate('/login');  // Redirect to login if no token is found
    }
  }, [navigate]);

  // If userId is not yet initialized, show a loading state or prevent routing
  if (!userId) {
    return <div>Loading...</div>;  // You can replace this with a spinner
  }

  return (
    <>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/app/${userId}`} element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;

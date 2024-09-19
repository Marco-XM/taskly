import { Route, Routes, Navigate } from 'react-router-dom';
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


const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

// Helper functions for JWT decoding
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
};

const decodeJwt = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT does not have 3 parts');
  }

  const payload = parts[1];
  const decodedPayload = base64UrlDecode(payload);
  return JSON.parse(decodedPayload);
};

// Safely retrieve the token and decode it
const token = localStorage.getItem('token');

let userId = null;
if (token) {
  try {
    const decodedToken = decodeJwt(token);
    userId = decodedToken._id; // Assuming the token contains _id
  } catch (error) {
    console.error('Failed to decode JWT:', error);
  }
}





const App = () => {
  const decodedToken = decodeJwt(token);
  userId = decodedToken._id; // Assuming the token contains _id
  return (
    <>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/app/${userId}`} element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<CalendarPage/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;

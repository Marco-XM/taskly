import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkSpace from './pages/WorkSpace';
import DashBoard from './pages/DashBoard';
import Registration from './pages/Registration';
import Login from './pages/Login';
import CalendarPage from './pages/CalendarPage';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

// Axios default configuration
axios.defaults.baseURL = 'https://taskly-backend-one.vercel.app';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// PrivateRoute component for protecting authenticated routes
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

// Helper function to get userId from the token

const base64UrlDecode = (str) => {
  // Convert Base64Url to Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad Base64 string if necessary
  while (base64.length % 4 !== 0) {
      base64 += '=';
  }
  // Decode Base64 string to a string
  return atob(base64);
};

const decodeJwt = (token) => {
  if (!token) {
      throw new Error('No token provided');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('JWT does not have 3 parts');
  }

  const payload = parts[1];
  const decodedPayload = base64UrlDecode(payload);
  return JSON.parse(decodedPayload);
};
const token = localStorage.getItem('token');
const decodedToken = decodeJwt(token);
const userId = decodedToken._id;
const App = () => {



  return (
    <>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Registration and Login pages should be blocked if the user is signed in */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Private route (only accessible when signed in) */}
        {userId && (
          <Route path={`/app/${userId}`} element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
        )}

        <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        
        {/* Catch-all route to redirect any undefined paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;

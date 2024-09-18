import { Route, Routes, Navigate, useParams } from 'react-router-dom';
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

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Use dynamic userId in routes */}
        <Route path="/app/:userId" element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
        <Route path="/dashboard/:userId" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path="/calendar/:userId" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;

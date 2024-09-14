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

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};


const taskBoxes = JSON.parse(localStorage.getItem('taskBoxes'));

const saveTasksToDB = async (userId) => {
  try {
    const response = await axios.post('https://taskly-backend-one.vercel.app/api/tasks', {
      userId: userId,
      taskBoxes: taskBoxes
    });
    console.log('Tasks Saved To DB:', response.data);
  } catch (error) {
    console.error('Error Saving tasks to DB:', error);
  }
};



const App = () => {
  return (
    <>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
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

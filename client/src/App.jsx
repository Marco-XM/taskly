import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkSpace from './pages/WorkSpace';
import DashBoard from './pages/DashBoard';
import Registration from './pages/Registration';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';


axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true


const App = () => {
  return (
    <>
    <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<WorkSpace />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  );
};
export default App;
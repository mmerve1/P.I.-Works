import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';


import UserProfile from './pages/profile/UserProfile';
import AdminProfile from './pages/profile/AdminProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/admin" element={<AdminProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
     
        
      </Routes>
    </Router>
  );
};

export default App;

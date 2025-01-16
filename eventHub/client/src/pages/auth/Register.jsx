// src/pages/auth/RegisterWithUserList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const RegisterWithUserList = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    location: '',
    interests: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    profile_picture: '',
    enabled: false, // Add enabled field
  });
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar alınırken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value, // Check if it's a checkbox
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.username || !formData.password) {
      setError('Tüm alanlar zorunludur.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.data) {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          password: '',
          location: '',
          interests: '',
          date_of_birth: '',
          gender: '',
          phone_number: '',
          profile_picture: '',
          enabled: false, // Reset enabled
        });
        fetchUsers();
        setError(null);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h2>USERS</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.enabled ? 'Evet' : 'Hayır'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="register-right">
        <h2>NEW USER</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <label>Display Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <label>Birth Date</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />

          <label>Enabled</label>
          <input
            type="checkbox"
            name="enabled"
            checked={formData.enabled}
            onChange={handleChange}
          />

          <button type="submit" className="register-button">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterWithUserList;

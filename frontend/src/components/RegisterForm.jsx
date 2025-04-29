import React, { useState } from 'react';
import api from '../utils/api';  // Ensure api.js points to the correct backend URL
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();  // useNavigate replaces useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      fullName,
      age,
      email,
      password,
    };

    try {
      // POST request to the backend
      const response = await api.post('/register', userData);
      console.log(response.data);
      navigate('/login');  // Replace history.push() with navigate() for React Router v6
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;

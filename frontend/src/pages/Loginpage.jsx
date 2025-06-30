// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection
import './Auth.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data)); // Store user info and token
      onLoginSuccess(data); // Pass data to App.jsx to update auth state
      setError(null);
      navigate('/'); // Redirect to homepage
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data.message : err.message);
      setError(err.response ? err.response.data.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        {loading && <p className="auth-loading">Loading...</p>}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          Login
        </button>
        <p className="auth-switch">
          New Customer? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
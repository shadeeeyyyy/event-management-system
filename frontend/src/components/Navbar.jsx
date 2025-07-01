// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSearchChange, currentSearchTerm, userInfo, onLogout }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Eventify
        </Link>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
            value={currentSearchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {userInfo ? (
            <>
              <li className="nav-item">
                <Link to="/mybookings" className="nav-link">My Bookings</Link> {/* New link */}
              </li>
              <li className="nav-item">
                <span className="nav-link profile-link">
                  Hi, {userInfo?.name?.split(' ')[0] || 'User'}
                </span>
              </li>
              <li className="nav-item">
                <button onClick={logoutHandler} className="nav-link logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link to="#" className="nav-link">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
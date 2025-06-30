// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ onSearchChange, currentSearchTerm }) => { // Accept props
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Eventify
        </a>
        <div className="search-bar-container"> {/* New container for search */}
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
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">About Us</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
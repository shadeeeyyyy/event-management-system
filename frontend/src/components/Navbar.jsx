// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSearchChange, currentSearchTerm, userInfo, onLogout }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false); // 👈 Scroll state

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}> {/* 👈 Apply 'scrolled' class */}
      <div className="navbar-container">
        <div>
          <Link to="/" className="navbar-logo">ElevatEvents</Link>
        </div>
        <div>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search events..."
              className="search-input"
              value={currentSearchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <ul className="nav-menu">
            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin/create-event" className="nav-link admin-link">Add Event</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/mybookings" className="nav-link">My Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link">Contact</Link>
                </li>
                <li className="nav-item">
                  <button onClick={logoutHandler} className="nav-link logout-button">Logout</button>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

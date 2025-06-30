// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailModal from './components/EventDetailModal';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  // State to hold user info (including token)
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

  useEffect(() => {
    // This useEffect runs once on mount to check for stored user info
    // This handles cases where user refreshes page, keeps them logged in
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleLoginSuccess = (data) => {
    setUserInfo(data);
    // localStorage.setItem('userInfo', JSON.stringify(data)); // Already done in LoginPage/RegisterPage
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Remove user info from storage
    setUserInfo(null); // Clear user info from state
    // Redirect to login page or home page (router will handle this if path changes)
  };


  return (
    <Router>
      <div className="App">
        <Navbar
          onSearchChange={handleSearchChange}
          currentSearchTerm={searchTerm}
          userInfo={userInfo} // Pass user info to Navbar
          onLogout={handleLogout} // Pass logout handler to Navbar
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage onSelectEvent={handleEventSelect} searchTerm={searchTerm} />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
            {/* More routes will go here for user profile, bookings etc. */}
          </Routes>
        </main>

        {selectedEvent && (
          <EventDetailModal event={selectedEvent} onClose={handleCloseModal} />
        )}
      </div>
    </Router>
  );
}

export default App;
// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import CreateEventPage from './pages/CreateEventPage'; // Import the new page
import EventDetailModal from './components/EventDetailModal';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

  useEffect(() => {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          onSearchChange={handleSearchChange}
          currentSearchTerm={searchTerm}
          userInfo={userInfo}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage onSelectEvent={handleEventSelect} searchTerm={searchTerm} />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/mybookings" element={<MyBookingsPage userInfo={userInfo} />} />
            {/* New route for creating events, accessible only by admin */}
            <Route path="/admin/create-event" element={<CreateEventPage userInfo={userInfo} />} />
          </Routes>
        </main>

        <div className={`modal-overlay-container ${selectedEvent ? 'active' : ''}`}>
          {selectedEvent && (
            <EventDetailModal
                event={selectedEvent}
                onClose={handleCloseModal}
                userInfo={userInfo}
            />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

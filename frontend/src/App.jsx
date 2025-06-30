// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EventDetailModal from './components/EventDetailModal';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="App">
      <Navbar onSearchChange={handleSearchChange} currentSearchTerm={searchTerm} />
      <main className="main-content">
        <HomePage onSelectEvent={handleEventSelect} searchTerm={searchTerm} />
      </main>

      {/* Conditionally render modal and apply 'active' class for transitions */}
      <div className={`modal-overlay-container ${selectedEvent ? 'active' : ''}`}>
        {selectedEvent && (
          <EventDetailModal event={selectedEvent} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default App;
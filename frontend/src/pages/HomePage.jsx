// src/pages/HomePage.jsx
import React from 'react';
import EventCarousel from '../components/EventCarousel';
import './HomePage.css';

const HomePage = ({ onSelectEvent, searchTerm }) => {
  return (
    <div className="homepage-container">
      <EventCarousel onSelectEvent={onSelectEvent} searchTerm={searchTerm} />
    </div>
  );
};

export default HomePage;

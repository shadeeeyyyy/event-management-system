// src/pages/HomePage.jsx
import React from 'react';
import EventList from '../components/EventList';
import './HomePage.css';

const HomePage = ({ onSelectEvent, searchTerm }) => {
  return (
    <div className="homepage-container">
      <h2 className="homepage-heading">Upcoming Events</h2>
      <EventList onSelectEvent={onSelectEvent} searchTerm={searchTerm} />
    </div>
  );
};

export default HomePage;
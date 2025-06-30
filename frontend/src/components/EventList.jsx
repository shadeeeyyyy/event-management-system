// src/components/EventList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import './EventList.css';

const EventList = ({ onSelectEvent, searchTerm }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setEvents([]); // Clear events on error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-message">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (filteredEvents.length === 0 && searchTerm) {
    return <div className="no-events-found">No events found matching "{searchTerm}".</div>;
  }

  if (filteredEvents.length === 0) {
    return <div className="no-events-found">No events available.</div>;
  }

  return (
    <div className="event-list-grid">
      {filteredEvents.map((event) => (
        <EventCard key={event._id} event={event} onClick={onSelectEvent} />
      ))}
    </div>
  );
};

export default EventList;
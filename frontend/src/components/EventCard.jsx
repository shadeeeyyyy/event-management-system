// src/components/EventCard.jsx
import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
  // Format date
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="event-card" onClick={() => onClick(event)}>
      <img src={event.imageUrl} alt={event.title} className="event-card-image" />
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-date">{eventDate}</p>
        <p className="event-card-location">{event.location}</p>
        <div className="event-card-category">{event.category}</div>
        {event.price > 0 ? (
          <p className="event-card-price">₹{event.price.toFixed(2)}</p>
        ) : (
          <p className="event-card-price">Free</p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
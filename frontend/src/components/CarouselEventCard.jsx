// src/components/CarouselEventCard.jsx
import React from 'react';
import './CarouselEventCard.css';

const CarouselEventCard = ({ event, isActive, onClick }) => {
  return (
    <div
      className={`carousel-event-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(event)}
    >
      <img src={event.imageUrl} alt={event.title} className="carousel-event-image" />
    </div>
  );
};

export default CarouselEventCard;

// src/components/EventDetailModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetailModal.css';

const EventDetailModal = ({ event, onClose }) => {
  const [fullEventDetails, setFullEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/events/${event._id}`);
        setFullEventDetails(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    if (event && event._id) {
      fetchEventDetails();
    }
  }, [event]); // Re-fetch if the `event` prop changes

  if (!event) return null; // Don't render if no event is selected

  const formattedDate = fullEventDetails ? new Date(fullEventDetails.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        {loading ? (
          <div className="modal-loading">Loading event details...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : (
          <>
            <img src={fullEventDetails.imageUrl} alt={fullEventDetails.title} className="modal-image" />
            <div className="modal-details">
              <h2 className="modal-title">{fullEventDetails.title}</h2>
              <p className="modal-info">
                <strong>Date:</strong> {formattedDate}
              </p>
              <p className="modal-info">
                <strong>Location:</strong> {fullEventDetails.location}
              </p>
              <p className="modal-info">
                <strong>Category:</strong> {fullEventDetails.category}
              </p>
              <p className="modal-description">{fullEventDetails.description}</p>
              <p className="modal-price">
                {fullEventDetails.price > 0 ? `Price: ₹${fullEventDetails.price.toFixed(2)}` : 'Price: Free'}
              </p>
              <p className="modal-tickets">
                Available Tickets: {fullEventDetails.availableTickets}
              </p>
              <button className="book-now-button">Book Now (Coming Soon!)</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailModal;
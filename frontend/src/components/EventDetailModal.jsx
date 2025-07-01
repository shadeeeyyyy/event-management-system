// src/components/EventDetailModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetailModal.css';

// Add userInfo prop
const EventDetailModal = ({ event, onClose, userInfo }) => {
  const [fullEventDetails, setFullEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketsToBook, setTicketsToBook] = useState(1); // State for tickets
  const [bookingMessage, setBookingMessage] = useState(null); // Success/Error message for booking

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
      setBookingMessage(null); // Clear booking message on modal open
      setTicketsToBook(1); // Reset tickets to 1
    }
  }, [event]);

  const handleBooking = async () => {
    if (!userInfo || !userInfo.token) {
      setBookingMessage('Please login to book tickets.');
      return;
    }

    if (ticketsToBook <= 0) {
      setBookingMessage('Please select at least 1 ticket.');
      return;
    }

    if (ticketsToBook > fullEventDetails.availableTickets) {
      setBookingMessage(`Only ${fullEventDetails.availableTickets} tickets available.`);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Attach JWT
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/bookings',
        { eventId: fullEventDetails._id, ticketsBooked: ticketsToBook },
        config
      );

      setBookingMessage(`Booking successful! Total Price: ₹${data.totalPrice.toFixed(2)}`);
      // Optionally, update available tickets in modal after booking
      setFullEventDetails(prevDetails => ({
        ...prevDetails,
        availableTickets: prevDetails.availableTickets - ticketsToBook
      }));
      setError(null);
    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data.message : err.message);
      setBookingMessage(err.response ? err.response.data.message : 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

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

        {loading && !fullEventDetails ? ( // Only show global loading if details not loaded yet
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

              {userInfo ? ( // Show booking form only if logged in
                <>
                  <div className="booking-form-group">
                    <label htmlFor="tickets">Tickets:</label>
                    <input
                      type="number"
                      id="tickets"
                      min="1"
                      max={fullEventDetails.availableTickets} // Max tickets based on availability
                      value={ticketsToBook}
                      onChange={(e) => setTicketsToBook(Number(e.target.value))}
                      disabled={fullEventDetails.availableTickets === 0 || loading} // Disable if no tickets or loading
                    />
                    {fullEventDetails.price > 0 && (
                      <span className="total-booking-price">
                        Total: ₹{(fullEventDetails.price * ticketsToBook).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {bookingMessage && (
                      <p className={`booking-status-message ${bookingMessage.includes('successful') ? 'success' : 'error'}`}>
                        {bookingMessage}
                      </p>
                  )}
                  <button
                    className="book-now-button"
                    onClick={handleBooking}
                    disabled={fullEventDetails.availableTickets === 0 || loading}
                  >
                    {loading ? 'Booking...' : (fullEventDetails.availableTickets === 0 ? 'Sold Out' : 'Book Now')}
                  </button>
                </>
              ) : (
                <p className="modal-login-prompt">
                  <Link to="/login">Login</Link> to book tickets.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailModal;
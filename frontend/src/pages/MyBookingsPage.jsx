// src/pages/MyBookingsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyBookingsPage.css';

const MyBookingsPage = ({ userInfo }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login?redirect=/mybookings'); // Redirect to login if not logged in
      return;
    }

    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Attach JWT
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching my bookings:', err.response ? err.response.data.message : err.message);
        setError(err.response ? err.response.data.message : 'Failed to fetch bookings.');
        // If token expires or invalid, auto-logout (optional, more robust error handling needed for production)
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('userInfo');
          // This will clear userInfo in App.jsx as well via state update
          // navigate to login will happen after state updates
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [userInfo, navigate]); // Rerun if userInfo changes (e.g., login/logout)

  if (loading) {
    return <div className="mybookings-message">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="mybookings-message mybookings-error">{error}</div>;
  }

  if (bookings.length === 0) {
    return <div className="mybookings-message">You have no bookings yet.</div>;
  }

  return (
    <div className="mybookings-container">
      <h2 className="mybookings-heading">My Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <img src={booking.event.imageUrl} alt={booking.event.title} className="booking-event-image" />
            <div className="booking-details">
              <h3 className="booking-title">{booking.event.title}</h3>
              <p className="booking-info">
                <strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
              <p className="booking-info"><strong>Location:</strong> {booking.event.location}</p>
              <p className="booking-info"><strong>Tickets:</strong> {booking.ticketsBooked}</p>
              <p className="booking-info"><strong>Total Paid:</strong> ₹{booking.totalPrice.toFixed(2)}</p>
              <p className="booking-info booking-status"><strong>Status:</strong> {booking.status}</p>
              <p className="booking-info booking-date">
                Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
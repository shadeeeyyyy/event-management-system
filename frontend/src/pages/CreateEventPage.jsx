// src/pages/CreateEventPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateEventPage.css'; // Create this CSS file

const CreateEventPage = ({ userInfo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(''); // Date as string for input type="datetime-local"
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Other'); // Default category
  const [price, setPrice] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!userInfo || !userInfo.token || !userInfo.isAdmin) {
      navigate('/login?redirect=/admin/create-event'); // Redirect to login, with redirect param
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Send JWT for authentication
        },
      };

      const eventData = {
        title,
        description,
        date, // Send as string, backend will parse to Date
        location,
        imageUrl,
        category,
        price: Number(price), // Ensure price is a number
        availableTickets: Number(availableTickets), // Ensure tickets is a number
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/events',
        eventData,
        config
      );

      setSuccess(`Event "${data.title}" created successfully!`);
      // Optionally clear form or redirect
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImageUrl('');
      setCategory('Other');
      setPrice(0);
      setAvailableTickets(0);

    } catch (err) {
      console.error('Error creating event:', err.response ? err.response.data.message : err.message);
      setError(err.response ? err.response.data.message : 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo || !userInfo.isAdmin) {
    // This will briefly show before redirect, or if redirect fails
    return <div className="create-event-message">Access Denied. Only administrators can create events.</div>;
  }

  return (
    <div className="create-event-container">
      <form className="create-event-form" onSubmit={submitHandler}>
        <h2>Create New Event</h2>
        {success && <p className="form-success">{success}</p>}
        {error && <p className="form-error">{error}</p>}
        {loading && <p className="form-loading">Creating event...</p>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="5"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date & Time</label>
          <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="e.g., https://example.com/event.jpg" />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Festival">Festival</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" required />
        </div>

        <div className="form-group">
          <label htmlFor="availableTickets">Available Tickets</label>
          <input type="number" id="availableTickets" value={availableTickets} onChange={(e) => setAvailableTickets(e.target.value)} min="0" required />
        </div>

        <button type="submit" className="create-event-button" disabled={loading}>
          {loading ? 'Adding Event...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;

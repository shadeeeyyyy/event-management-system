const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Import the Event model

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}); // Find all events
        res.json(events); // Send them as JSON response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id); // Find event by ID from URL
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        // Handle invalid object ID format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Event ID format' });
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event'); // Need Event model to update availableTickets
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (requires authentication)
router.post('/', protect, async (req, res) => {
    const { eventId, ticketsBooked } = req.body;
    const userId = req.user._id; // User ID comes from the 'protect' middleware (req.user)

    if (!eventId || !ticketsBooked || ticketsBooked <= 0) {
        res.status(400).json({ message: 'Please provide event ID and valid number of tickets.' });
        return;
    }

    try {
        // Find the event
        const event = await Event.findById(eventId);

        if (!event) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }

        // Check if enough tickets are available
        if (event.availableTickets < ticketsBooked) {
            res.status(400).json({ message: 'Not enough tickets available for this event.' });
            return;
        }

        // Calculate total price
        const totalPrice = event.price * ticketsBooked;

        // Create the booking
        const booking = new Booking({
            user: userId,
            event: eventId,
            ticketsBooked,
            totalPrice,
            status: 'Confirmed', // For MVP, default to confirmed
        });

        const createdBooking = await booking.save();

        // Decrease available tickets for the event (Important!)
        event.availableTickets -= ticketsBooked;
        await event.save(); // Save updated event

        // Populate user and event details for the response
        const populatedBooking = await Booking.findById(createdBooking._id)
            .populate('user', 'name email') // Get name and email from User
            .populate('event', 'title date location price'); // Get specific fields from Event

        res.status(201).json(populatedBooking); // 201 Created
    } catch (error) {
        // Handle potential Mongoose CastError for invalid Object ID
        if (error.name === 'CastError' && error.path === 'event') {
            return res.status(400).json({ message: 'Invalid event ID format.' });
        }
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
});

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private (requires authentication)
router.get('/mybookings', protect, async (req, res) => {
    try {
        // Find bookings where the 'user' field matches the logged-in user's ID
        // .populate('event') will replace the event's ObjectId with the full event document
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event', 'title date location imageUrl'); // Select specific fields from event
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
});

// Optional: Admin can get all bookings
// @desc    Get all bookings (for admin)
// @route   GET /api/bookings
// @access  Private/Admin
// router.get('/', protect, admin, async (req, res) => {
//     try {
//         const bookings = await Booking.find({})
//             .populate('user', 'name email')
//             .populate('event', 'title date');
//         res.json(bookings);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;
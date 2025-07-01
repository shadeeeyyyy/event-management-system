const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: { // Reference to the User who made the booking
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Refers to the 'User' model
        },
        event: { // Reference to the Event being booked
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Event', // Refers to the 'Event' model
        },
        ticketsBooked: {
            type: Number,
            required: true,
            default: 1, // At least one ticket
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        bookingDate: {
            type: Date,
            required: true,
            default: Date.now, // Automatically set to current date/time
        },
        status: {
            type: String,
            required: true,
            enum: ['Confirmed', 'Pending', 'Cancelled'], // Possible statuses
            default: 'Confirmed', // Default to confirmed for simplicity in MVP
        },
        // You could add payment details, seat numbers, etc., later
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
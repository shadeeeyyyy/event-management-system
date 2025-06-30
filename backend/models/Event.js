const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date, // Stores date and time
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        imageUrl: { // URL to an image for the event poster
            type: String,
            default: 'https://via.placeholder.com/400x250.png?text=Event+Image', // Placeholder image
        },
        category: {
            type: String,
            enum: ['Music', 'Sports', 'Conference', 'Workshop', 'Festival', 'Other'], // Enforce specific categories
            default: 'Other',
        },
        price: {
            type: Number,
            default: 0, // Free events by default
        },
        availableTickets: {
            type: Number,
            default: 0, // No tickets by default
        },
        // Later: Add fields for creator (user ID), etc.
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
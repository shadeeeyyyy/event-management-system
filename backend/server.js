const express = require('express');
const dotenv = require('dotenv'); // To load environment variables from .env file
const cors = require('cors');     // To allow cross-origin requests
const connectDB = require('./config/db'); // Import database connection function
const eventRoutes = require('./routes/eventRoutes'); // Import event routes

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data (to accept JSON in request body)
app.use(cors());         // Enable CORS for all routes (important for frontend communication)

// Basic route for checking if server is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Event Routes
app.use('/api/events', eventRoutes); // All routes in eventRoutes.js will be prefixed with /api/events

// Error handling middleware (optional but good practice, we'll refine later)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define the port to listen on
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Email must be unique for each user
        },
        password: { // This will store the HASHED password
            type: String,
            required: true,
        },
        isAdmin: { // For future admin functionalities
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// --- Mongoose Middleware (Pre-save hook for password hashing) ---
// This will run BEFORE a user document is saved (or updated if password changed)
userSchema.pre('save', async function (next) {
    // Only hash if the password field is actually modified
    if (!this.isModified('password')) {
        next(); // If password is not modified, move to the next middleware/save operation
    }

    // Generate a salt (random string) to add complexity to hashing
    const salt = await bcrypt.genSalt(10); // 10 is a good balance between security and performance
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
});

// --- Mongoose Method for Password Comparison ---
// This method will be available on user documents (e.g., user.matchPassword(enteredPassword))
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Compare the entered password (after hashing it) with the stored hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
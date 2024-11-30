const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensure Name is provided
  },
  email: {
    type: String,
    required: true, // Ensure Email is provided
    unique: true,   // Ensure Unique Email is provided
  },
  password: {
    type: String,
    required: true, // Ensure password is provided (for traditional authentication)
  },
  googleId: {
    type: String,  // Google OAuth ID (only for Google login)
    unique: true,  // Ensure Google ID is unique (useful for Google login)
    sparse: true,  // Allow `googleId` to be missing for email/password users
  },
  accessToken: {
    type: String,  // Access token for interacting with YouTube API (only for Google login)
    sparse: true,  // Allow `accessToken` to be missing for email/password users
  },
}, { timestamps: true });

// Export User Model
module.exports = mongoose.model('User', userSchema);

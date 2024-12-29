const express = require('express');
const passport = require('passport');
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = express.Router();

// Google Login Route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly']
}));

// Google OAuth callback Route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Profile Route (Authenticated)
router.get('/profile',isAuthenticated,  (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.json({
        name: req.user.name,
        email: req.user.email,
        googleId: req.user.googleId,
    });
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout Failed" });
        }
        res.redirect('/');
        
    });
});

module.exports = router;

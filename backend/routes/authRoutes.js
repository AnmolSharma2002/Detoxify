const express = require('express');
const passport = require('passport');
const router = express.Router();

//Google Login Route

router.get('/google', passport.authenticate('google',{
    scope:['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly']
}));

//Google OAuth callback Route

router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/'}),
    (req, res)=>{
        res.redirect('/profile');
    }
);

module.exports = router;
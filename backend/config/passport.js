const passport = require('passport');
const { Strategy: OAuth2Strategy } = require('passport-google-oauth20'); // Correct import
const User = require('../models/userModel');



passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Corrected typo: 'cliend_ID' to 'clientID'
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Corrected typo: 'cliend_Seceret' to 'clientSecret'
    callbackURL: "http://localhost:5000/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    accessToken,
                });
                await user.save();
            }
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
));
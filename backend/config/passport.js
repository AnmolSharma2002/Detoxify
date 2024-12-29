const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/userModel');  // User model where we store user data

// Google OAuth strategy for authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find user in the database
      let user = await User.findOne({ googleId: profile.id });

      // If user does not exist, create a new one
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          accessToken,
        });
        await user.save();
      }

      // Pass the user data to the next step (serializeUser)
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
));

// Serialize the user into the session (store user's ID in the session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session (retrieve user info from DB using user ID)
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

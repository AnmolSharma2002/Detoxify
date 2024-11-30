const passport = require('passport');
const { OAuth2Strategy  } = require('passport-google-oauth20');
const User = require('../models/userModel');

passport.use(new OAuth2Strategy({
    cliend_ID:process.env.GOOGLE_CLIENT_ID,
    cliend_Seceret:process.env.GOOGLE_CLIENT_ID,
    callbackURL:"http://localhost:5000/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done)=>{
        try{
            let user = await User.findOne({ googleId: profile.id });
            if(!user){
                user = new User({
                    googleId:profile.id,
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    accessToken,
                });
                await user.save();
            }
            done(null, user);
        }catch(error){
            done(error, false);
        }
    }
)) 
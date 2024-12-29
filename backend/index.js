const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

require('dotenv').config(); 
require('./config/passport');


const app = express();

//Middlewares

app.use(cors());
app.use(express.json()); // To parse JSON req 

app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        cookie: { secure:false} //Set True in production stage
    }
));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api',youtubeRoutes );

//Connect to MongoDB

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

connectDB();

//Routes
app.get('/',(req, res)=>{
    res.send("Welcome!!")
})

//Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server Running on ${PORT}`);
});
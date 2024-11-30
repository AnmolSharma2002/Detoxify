const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

// Create User (Register)
const creatUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const registeredUser = await User.findOne({ email });
        if (registeredUser) {
            return res.status(400).json({ message: "EMAIL ALREADY EXISTS" });
        }

        // Hash Password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a Single User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash new Password if provided
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user Fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password: hashedPassword || undefined },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User Login
const userLoginIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User by Email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "INVALID CREDENTIALS" });
        }

        // Compare the hashed Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "INVALID CREDENTIALS" });
        }

        // If matched, generate JWT token
        const token = generateToken(user);

        // Send the response with the token
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { creatUser, getUsers, getUserById, updateUser, deleteUser, userLoginIn };

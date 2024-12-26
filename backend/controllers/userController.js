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
        const { name, email, password, currentPassword } = req.body;

        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If password is being updated, verify current password
        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to update the password' });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
        }

        // Hash new password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Update user fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                email, 
                ...(hashedPassword && { password: hashedPassword }) 
            },
            { new: true }
        );

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
        console.log(user);
        // If matched, generate JWT token
        const token = generateToken(user);

        // Send the response with the token
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { creatUser, getUsers, getUserById, updateUser, deleteUser, userLoginIn };

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

//Create User(Register)

const creatUser  = async (req, res) => {
    try {
        const {name ,email, password} = req.body;
        
        const registerdUser = await User.findOne({email});
        if(registerdUser){
            return res.status(400).json({message:"EMAIL ALREADY EXISTS"});
        }

        //Hash Password before saving

        const hashedPassowrd = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, 
            email, 
            password : hashedPassowrd
        });
        await newUser.save();
        res.status(201).json({message:"User created successfully", user:newUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    
};

//Get all Users
const getUsers = async (req, res)=>{
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Get a Single User by ID

const getUserById = async (req, res) => {
    try{
        const user = await user.findById(req.params.id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json(user);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//Update User 

const updateUser = async(req, res)=>{
    try {
        const {name, email , password} = req.body;
        //Hash new Password if provided
        let hashedPassowrd;
        if (password){
            hashedPassowrd = await bcrypt.hash(password, 10);
        }

        //Update user Fields

        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            { name, email, password: hashedPassword || undefined },
            { new: true }
        );

        if(!updateUser){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Delete User

const deleteUser  = async (req , res) => {
    try {
        const user = await User.findByIdAndDelete(
            req.params.id
        );
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {creatUser , getUsers , getUserById , updateUser , deleteUser};
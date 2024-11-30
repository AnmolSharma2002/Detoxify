const express = require('express');
const {
    creatUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    userLoginIn
} = require('../controllers/userController');
const {authenticateJWT} = require('../config/jwt');  // Custom JWT Middleware
const validateUser = require('../middlewares/validateUser');
const router = express.Router();

// Route to create User with validation
router.post('/', validateUser, creatUser);

// Route to get all Users (requires authentication)
router.get('/', authenticateJWT, getUsers);

// Route to get a specific User by ID (requires authentication)
router.get('/:id', authenticateJWT, getUserById);

// Route to update User information (requires authentication)
router.put('/:id', authenticateJWT, updateUser);

// Route to delete User information (requires authentication)
router.delete('/:id', authenticateJWT, deleteUser);

// Route to login 
router.post('/login', userLoginIn);

module.exports = router;

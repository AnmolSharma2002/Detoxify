const express = require('express');
const {
    creatUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const router = express.Router();

//Route to create User

router.post('/', creatUser);

//Router to getUsers

router.get('/', getUsers);

//Router to get specific user

router.get('/:id', getUserById);

//Router to update user information

router.put('/:id', passport.authenticate('jwt',{ session:false }),updateUser);


//Router to delete the User information

router.delete('/:id', passport.authenticate('jwt',{ session:false }),deleteUser);

module.exports = router;
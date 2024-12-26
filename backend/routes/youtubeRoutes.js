const express = require('express');
const { getYoutubeData } = require( '../controllers/youtubeController');
const {authenticateJWT} = require('../config/jwt');
const router = express.Router();

//Router to fetch Youtube Data
router.get('/youtube-data', authenticateJWT, getYoutubeData);

module.exports = router;
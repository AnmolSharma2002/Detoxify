const axios = require('axios');

exports.getYoutubeData = async (req, res) => {
    const accessToken  = req.user.accessToken;
    
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos',{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            },
            params:{
                part:'snippet,statistics',
                myRating:'like'
            },
        });

        res.status(200).json(respose.data);
    } catch (error) {
        console.error('YouTube API Error:', error.response.data);
        res.status(500).json({ message: 'Error fetching YouTube data', error: error.message });
    }
};
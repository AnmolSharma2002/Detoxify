const jwt = require('jsonwebtoken');


//Genrate JWT token

const generateToken = (user) =>{
    return jwt.sign(
        {
            id:user._id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {expiresIn:'6h'}
    );
};

const verifyToken = (token) =>{
    try{
        return jwt.verify(token , process.env.JWT_SECRET);
    } catch(error) {
        return null;
    }
};

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Extract token from 'Authorization' header
    if (!token) {
        return res.status(403).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded token data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { generateToken, verifyToken , authenticateJWT};
const jwt = require("jsonwebtoken");
const User = require('../models/user');

const auth = async(req,res,next)=>{
    try {
        // Extract token from the request header
        // Note: The header name is case-insensitive, so 'x-auth-token' or 'X-Auth-Token' can be used.
        const token = req.header('x-auth-token');
        // If no token is provided, return 401 (unauthorized) error with an authentication denied message.
        if(!token) return res.status(401).json({msg:"No authentication token, authorrization denied"});
        // Verify the JWT token using the secret key.
        const verified = await jwt.verify(token,"passwordKey");
        // If token verification failed, return 401 (unauthorized) error with a message.
        if(!verified) return res.status(401).json({msg:"Token verification failed, authorization denied"});
        // Find the user in the database using the id stored in the token payload.
        const user = await User.findById(verified.id);
        // If user not found, return 401 (unauthorized) error.
        if(!user) return res.status(401).json({msg:"User not found, authorization denied"});
        // Attach the authenticated user to the request object.
        req.user = user;
        // Attach the token also in request object if needed later.
        req.token = token;
        // Proceed to the next middleware or route.
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({error:error.message});
    }
}

module.exports = auth;
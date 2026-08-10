const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Check if the request has an 'Authorization' header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 2. The token usually comes as "Bearer ". This splits it to just grab the token part.
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        // 3. Verify the token using your secret key from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the user info (like ID and Role) to the request so your routes can use it
        req.user = decoded; 
        
        // 5. Allow the user to proceed to the next step
        next(); 
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
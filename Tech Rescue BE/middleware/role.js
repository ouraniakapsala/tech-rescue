// middleware/role.js
module.exports = function (allowedRoles) {
    return function (req, res, next) {
        // Rejects the request if the authenticated user's role is not in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        
        // Proceeds to the controller if the role matches
        next();
    };
};
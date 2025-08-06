const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // For development, allow requests without token
            // In production, uncomment the line below
            // return res.status(401).json({ error: 'Authentication required' });
            return next();
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

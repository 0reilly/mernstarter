const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key');
    req.userId = decoded.userId;
    console.log('User authenticated:', req.userId);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token', errorType: 'InvalidToken' });
  }
};

module.exports = auth;
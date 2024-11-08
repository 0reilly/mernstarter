const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../model/User');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    body('username', 'Username is required and should be 3+ characters')
      .isLength({ min: 3 }),
    body('password', 'Password is required and should be 6+ characters')
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { username, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ username });
      if (user) {
        console.log('Signup Attempt: Username already exists:', username);
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      user = new User({ username, password });
      await user.save();

      // Generate JWT with username
      const payload = { userId: user._id, username: user.username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      console.log('User Registered Successfully:', username);
      res.status(201).json({ token });
    } catch (err) {
      console.error('Server Error during Signup:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/login',
  [
    body('username', 'Username is required').exists(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { username, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ username });
      if (!user) {
        console.log('Login Attempt: Username does not exist:', username);
        return res.status(400).json({ error: 'Invalid Credentials' });
      }

      // Check password (assuming you have a method to compare passwords)
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Login Attempt: Incorrect password for user:', username);
        return res.status(400).json({ error: 'Invalid Credentials' });
      }

      // Generate JWT with username
      const payload = { userId: user._id, username: user.username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      console.log('User Logged In Successfully:', username);
      res.json({ token });
    } catch (err) {
      console.error('Server Error during Login:', err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

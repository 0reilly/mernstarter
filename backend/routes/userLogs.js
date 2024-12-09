const express = require('express');
const router = express.Router();
const UserLog = require('../models/UserLog');

// Test endpoint with user log creation
router.get('/test', async (req, res) => {
  const { userId, source } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    await UserLog.create({
      username: userId,
      source: source || 'web'
    });

    res.status(200).json({
      message: `Backend connection successful for user ${userId}!`
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user logs endpoint
router.get('/user-logs/:username', async (req, res) => {
  try {
    const logs = await UserLog.find({ 
      username: req.params.username 
    })
    .sort({ timestamp: -1 })
    .limit(10);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
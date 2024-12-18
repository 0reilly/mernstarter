const express = require('express');
const router = express.Router();
const userLogsRoutes = require('./userLogs');
const aiRoutes = require('./ai');

// Mount routes
router.use('/api', userLogsRoutes);
router.use('/api/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = router; 
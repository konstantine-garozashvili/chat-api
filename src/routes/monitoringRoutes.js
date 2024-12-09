const express = require('express');
const router = express.Router();
const { promClient } = require('../middleware/metrics');
const auth = require('../middleware/auth');

router.get('/metrics', auth, async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

module.exports = router; 
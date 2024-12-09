const express = require('express');
const router = express.Router();
const path = require('path');

// Serve widget files
router.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/widget.js'));
});

router.get('/widget.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/widget.css'));
});

router.get('/widget-loader.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/widget-loader.js'));
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const checkForAlerts = require('../utils/alertGenerator');

router.post('/', async (req, res) => {
  try {
    const measurement = await Measurement.create(req.body);
    await checkForAlerts(measurement);
    res.status(201).json(measurement);
  } catch (error) {
    console.error('Error creating measurement:', error);
    res.status(500).json({ error: 'Error creating measurement' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching alerts' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      { visto: req.body.visto },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Alerta no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando alerta' });
  }
});




module.exports = router;

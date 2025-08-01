const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  tankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank' },
  temperature: Number,
  ph: Number,
  conductivity: Number,
  timestamp: Date
});

module.exports = mongoose.model('Measurement', MeasurementSchema);
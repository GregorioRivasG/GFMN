const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  tankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  tankName: { type: String, required: true },
  parametro: { type: String, required: true },
  valor: { type: Number, required: true },
  umbral: { type: String, required: true },
  gravedad: { type: String, required: true },
  estado: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tipoSensor: { type: String, required: true },
  visto: { type: Boolean, default: false },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Alert', alertSchema);

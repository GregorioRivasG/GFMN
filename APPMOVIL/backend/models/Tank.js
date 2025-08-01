const mongoose = require('mongoose');

const TankSchema = new mongoose.Schema({
  name: String,
  ubicacion: String,
  description: String,
  conductividad: String,
  ph: String,
  temperatura: String,
  estado: String,
  fecha: Date
}, { timestamps: true });

module.exports = mongoose.model('Tank', TankSchema);
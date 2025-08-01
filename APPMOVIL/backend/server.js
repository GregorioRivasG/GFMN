require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');    
const authRoutes = require('./routes/auth');     
const Tank = require('./models/Tank');
const Measurement = require('./models/Measurement');
const app = express();

connectDB();
const alertRoutes = require('./routes/alerts');
app.use('/api/alerts', alertRoutes);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/tanks', async (req, res) => {
  try {
    const tanks = await Tank.find();
    res.json(tanks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/measurements/:tankId', async (req, res) => {
  try {
    const measurements = await Measurement.find({ tankId: req.params.tankId })
      .sort({ timestamp: -1 })
      .limit(24); 
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

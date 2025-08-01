const Alert = require('../models/Alert');
const Tank = require('../models/Tank');

const checkForAlerts = async (measurement) => {
  const alerts = [];
  const tank = await Tank.findById(measurement.tankId);

  if (!tank) return;

  if (measurement.ph < 6.5 || measurement.ph > 8.5) {
    alerts.push({
      parametro: 'pH',
      valor: measurement.ph,
      umbral: '6.5 - 8.5',
      gravedad: 'Alta',
      estado: 'Fuera de rango',
      tipoSensor: 'Sensor de pH',
      imageUrl: 'https://pecesmarinos.es/wp-content/uploads/2023/04/peces-cirujano-naso-elegans.jpg'
    });
  }

  if (measurement.temperature < 22 || measurement.temperature > 28) {
    alerts.push({
      parametro: 'Temperatura',
      valor: measurement.temperature,
      umbral: '22 - 28',
      gravedad: 'Alta',
      estado: 'Crítica',
      tipoSensor: 'Sensor de temperatura',
      imageUrl: 'https://complementosparaaves.com/blog/wp-content/uploads/2024/10/Designer-4.jpeg'
    });
  }

  if (measurement.conductivity < 500 || measurement.conductivity > 1500) {
    alerts.push({
      parametro: 'Conductividad',
      valor: measurement.conductivity,
      umbral: '500 - 1500',
      gravedad: 'Media',
      estado: 'Alta',
      tipoSensor: 'Sensor de conductividad',
      imageUrl: 'https://www.zooplus.es/magazine/wp-content/uploads/2021/02/Goldfish.webp'
    });
  }

  for (const a of alerts) {
    await Alert.create({
      ...a,
      tankId: tank._id,
      tankName: tank.name,
      timestamp: measurement.timestamp || new Date()
    });
  }
};

module.exports = checkForAlerts;

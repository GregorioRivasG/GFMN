import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const ReportDetail = ({ route }) => {
  const { tankData, measurements } = route.params;
  const pdfRef = useRef();
  const [loading, setLoading] = useState(false);


  const chartData = {
    temperature: measurements.map(m => m.temperature),
    ph: measurements.map(m => m.ph),
    conductivity: measurements.map(m => m.conductivity),
    labels: measurements.map((m, i) => {
      const date = new Date(m.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    })
  };


  const generateHTML = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #003B73; text-align: center; }
            .section { margin-bottom: 20px; }
            .card { 
              background: #F8F9FA; 
              padding: 15px; 
              border-radius: 10px; 
              margin-bottom: 15px;
            }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Reporte de ${tankData.name}</h1>
          
          <div class="section">
            <h2>📌 Información Básica</h2>
            <div class="card">
              <p><strong>Ubicación:</strong> ${tankData.ubicacion}</p>
              <p><strong>Estado:</strong> ${tankData.estado}</p>
              <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="section">
            <h2>📊 Datos de Mediciones</h2>
            <div class="card">
              <table>
                <tr>
                  <th>Hora</th>
                  <th>Temperatura (°C)</th>
                  <th>pH</th>
                  <th>Conductividad (μS/cm)</th>
                </tr>
                ${measurements.slice(0, 10).map(m => `
                  <tr>
                    <td>${new Date(m.timestamp).toLocaleTimeString()}</td>
                    <td>${m.temperature.toFixed(2)}</td>
                    <td>${m.ph.toFixed(2)}</td>
                    <td>${m.conductivity.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>

          <div class="section">
            <h2>📈 Estadísticas</h2>
            <div class="card">
              <p><strong>Temperatura promedio:</strong> ${(measurements.reduce((a, b) => a + b.temperature, 0) / measurements.length).toFixed(2)} °C</p>
              <p><strong>pH promedio:</strong> ${(measurements.reduce((a, b) => a + b.ph, 0) / measurements.length).toFixed(2)}</p>
              <p><strong>Conductividad promedio:</strong> ${(measurements.reduce((a, b) => a + b.conductivity, 0) / measurements.length).toFixed(2)} μS/cm</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Print.printAsync({ uri }); // Abre el visor de PDF
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} ref={pdfRef}>
      <Text style={styles.title}>Reporte: {tankData.name}</Text>
      

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Temperatura (°C)</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.temperature }]
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix="°C"
          chartConfig={chartConfig('#FF6B6B')}
          bezier
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Nivel de pH</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.ph }]
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix=" pH"
          chartConfig={chartConfig('#4A90E2')}
          bezier
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Conductividad (μS/cm)</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.conductivity }]
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix=" μS/cm"
          chartConfig={chartConfig('#50C878')}
          bezier
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={generatePDF}
        disabled={loading}
      >
        <Ionicons name="download-outline" size={24} color="white" />
        <Text style={styles.buttonText}>
          {loading ? 'Generando...' : 'Descargar Reporte'}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 70 }} />
    </ScrollView>
  );
};


const chartConfig = (color) => ({
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(${hexToRgb(color)}, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: color
  }
});


const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '0, 0, 0';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 0,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B73',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00A8E8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default ReportDetail;
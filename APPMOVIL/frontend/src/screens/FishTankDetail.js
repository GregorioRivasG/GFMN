import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const FishTankDetail = ({ route }) => {
  const { tankId, tankName, tankData } = route.params;
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const _URL = 'http://10.72.86.217:5000';

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(`${_URL}/api/measurements/${tankId}`);
        setMeasurements(response.data.reverse());
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [tankId]);


  const chartData = {
    temperature: measurements.map(m => m.temperature),
    ph: measurements.map(m => m.ph),
    conductivity: measurements.map(m => m.conductivity),
    labels: measurements.map((m, i) => {
      const date = new Date(m.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    })
  };


  const currentData = measurements.length > 0 ? measurements[measurements.length - 1] : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A8E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tankName || 'Pecera'}</Text>
        <Text style={styles.subtitle}>{tankData.ubicacion}</Text>
        
        {currentData && (
          <View style={styles.currentDataContainer}>
            <View style={styles.dataRow}>
              <Ionicons name="thermometer-outline" size={24} color="#FF6B6B" />
              <Text style={styles.dataText}>{currentData.temperature} °C</Text>
            </View>
            <View style={styles.dataRow}>
              <Ionicons name="water-outline" size={24} color="#4A90E2" />
              <Text style={styles.dataText}>pH {currentData.ph}</Text>
            </View>
            <View style={styles.dataRow}>
              <Ionicons name="pulse-outline" size={24} color="#50C878" />
              <Text style={styles.dataText}>{currentData.conductivity} μS/cm</Text>
            </View>
          </View>
        )}
      </View>


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
          yAxisInterval={1}
          chartConfig={chartConfig('#FF6B6B')}
          bezier
          style={styles.chart}
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
          yAxisInterval={0.5}
          chartConfig={chartConfig('#4A90E2')}
          bezier
          style={styles.chart}
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
          style={styles.chart}
        />
      </View>


      <View style={[styles.statusContainer, 
                   { backgroundColor: tankData.estado === 'Normal' ? '#E8F5E9' : '#FFEBEE' }]}>
        <Ionicons 
          name={tankData.estado === 'Normal' ? 'checkmark-circle' : 'alert-circle'} 
          size={24} 
          color={tankData.estado === 'Normal' ? '#4CAF50' : '#F44336'} 
        />
        <Text style={styles.statusText}>Estado: {tankData.estado}</Text>
      </View>
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
  style: {
    borderRadius: 16
  },
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#0077B6',
    marginBottom: 15,
  },
  currentDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataRow: {
    alignItems: 'center',
  },
  dataText: {
    fontSize: 16,
    marginTop: 5,
    color: '#003B73',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B73',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#003B73',
    fontWeight: '500',
  },
});

export default FishTankDetail;
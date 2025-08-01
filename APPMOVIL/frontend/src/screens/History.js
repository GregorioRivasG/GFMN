
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const History = ({ navigation }) => {
  const [tanks, setTanks] = useState([]);
  const [measurements, setMeasurements] = useState({}); 
  const [loading, setLoading] = useState(true);
  const _URL = 'http://10.72.86.217:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tanksRes = await axios.get(`${_URL}/api/tanks`);
        setTanks(tanksRes.data);
        const measurementsData = {};
        for (const tank of tanksRes.data) {
          const measurementsRes = await axios.get(`${_URL}/api/measurements/${tank._id}`);
          measurementsData[tank._id] = measurementsRes.data;
        }
        setMeasurements(measurementsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = (tank) => {
    if (!measurements[tank._id] || measurements[tank._id].length === 0) {
      alert('No hay mediciones disponibles para esta pecera');
      return;
    }
    navigation.navigate('ReportDetail', {
      tankData: tank,
      measurements: measurements[tank._id]
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('FishTankDetail', {
          tankId: item._id,
          tankName: item.name,
          tankData: item
        })}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="fish-outline" size={24} color="#00A8E8" />
          <Text style={styles.tankName}>{item.name}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>📍 {item.ubicacion}</Text>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={item.estado === 'Normal' ? 'checkmark-circle' : 'alert-circle'} 
              size={16} 
              color={item.estado === 'Normal' ? '#4CAF50' : '#F44336'} 
            />
            <Text style={styles.statusText}>{item.estado}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => handleGenerateReport(item)}
      >
        <Text style={styles.reportButtonText}>Generar Reporte</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A8E8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Peceras</Text>
      <FlatList
        data={tanks}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003B73',
    marginLeft: 10,
  },
  details: {
    marginLeft: 34,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#666',
  },
  reportButton: {
    backgroundColor: '#00A8E8',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default History;
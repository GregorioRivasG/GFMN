import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

const FishTanks = ({ navigation }) => {
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const _URL = 'http://10.72.86.217:5000';

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const response = await axios.get(`${_URL}/api/tanks`);
        setTanks(response.data);
      } catch (error) {
        console.error('Error fetching tanks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTanks();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      delay={index * 100}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => navigation.navigate('FishTankDetail', { 
          tankId: item._id,
          tankName: item.name || 'Pecera sin nombre',
          tankData: item
        })}
      >
        <Ionicons name="water-outline" size={28} color="#00A8E8" style={{ marginRight: 15 }} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name || 'Pecera sin nombre'}</Text>
          <Text style={styles.location}>{item.ubicacion}</Text>
          <View style={styles.statusContainer}>
            <Ionicons 
              name="alert-circle" 
              size={16} 
              color={item.estado === 'Normal' ? '#4CAF50' : '#F44336'} 
            />
            <Text style={styles.status}>{item.estado}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
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
      <Text style={styles.title}>Mis Peceras</Text>
      
      <FlatList
        data={tanks}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default FishTanks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003B73',
    marginTop: 40,
    marginBottom: 25,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevación para Android
    elevation: 5,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    color: '#003B73',
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    marginLeft: 5,
    color: '#666',
  },
});
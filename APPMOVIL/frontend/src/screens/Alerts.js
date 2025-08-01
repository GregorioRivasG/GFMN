import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Alerts = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://10.72.86.217:5000/api/alerts';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const formatted = data.map(alert => {
          const date = new Date(alert.timestamp);
          return {
            ...alert,
            fecha: date.toLocaleDateString(),
            hora: date.toLocaleTimeString(),
            id: alert._id
          };
        });

        setAlerts(formatted);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const gravedadColor = (nivel) => {
    switch (nivel.toLowerCase()) {
      case 'alta': return '#D72638';
      case 'media': return '#FFA500';
      case 'baja': return '#0077B6';
      default: return '#555';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.visto && { opacity: 0.6 }]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AlertDetail', { alert: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="warning" size={28} color={gravedadColor(item.gravedad)} />
          <Text style={[styles.parametro, { color: gravedadColor(item.gravedad) }]}>
            {item.parametro} - {item.estado}
          </Text>
        </View>
        <Text style={styles.tankName}>Pecera: {item.tankName}</Text>
        <Text style={styles.valor}>
          Valor: {item.valor}  |  Umbral: {item.umbral}
        </Text>
        <Text style={styles.fecha}>
          Fecha: {item.fecha}  |  Hora: {item.hora}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00A8E8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas Activas</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Alerts;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003B73',
    textAlign: 'center',
    marginBottom: 25,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  parametro: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  tankName: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
    marginBottom: 4,
  },
  valor: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  fecha: {
    fontSize: 13,
    color: '#999',
  },
});

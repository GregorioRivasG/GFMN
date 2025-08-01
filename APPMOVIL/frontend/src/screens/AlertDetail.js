import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AlertDetail = ({ route, navigation }) => {
  const { alert } = route.params;

  const markAsSeen = async () => {
    try {
      const res = await fetch(`http://10.72.86.217:5000/api/alerts/${alert.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visto: true })
      });

      if (res.ok) {
        Alert.alert('Marcada como vista', 'Esta alerta ha sido marcada como revisada.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo marcar como vista.');
      }
    } catch (error) {
      console.error('Error marcando como vista:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="error-outline" size={50} color="#FF6B6B" />
        <Text style={styles.title}>Alerta de {alert.parametro}</Text>
      </View>

      <Image source={{ uri: alert.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.infoBox}>
        <Text style={styles.label}>🐠 Pecera:</Text>
        <Text style={styles.value}>{alert.tankName}</Text>

        <Text style={styles.label}>📟 Sensor:</Text>
        <Text style={styles.value}>{alert.tipoSensor}</Text>

        <Text style={styles.label}>⚠️ Nivel de Gravedad:</Text>
        <Text style={[styles.value, { color: alert.gravedad === 'Alta' ? '#D72638' : '#E29500' }]}>
          {alert.gravedad}
        </Text>

        <Text style={styles.label}>📈 Valor Actual:</Text>
        <Text style={styles.value}>{alert.valor}</Text>

        <Text style={styles.label}>🧪 Valor Umbral:</Text>
        <Text style={styles.value}>{alert.umbral}</Text>

        <Text style={styles.label}>📅 Fecha y hora:</Text>
        <Text style={styles.value}>{alert.fecha} {alert.hora}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={markAsSeen}>
        <Text style={styles.buttonText}>Marcar como vista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AlertDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    color: '#003B73',
    fontWeight: 'bold',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#CAF0F8',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#003B73',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#003B73',
  },
  button: {
    backgroundColor: '#00A8E8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

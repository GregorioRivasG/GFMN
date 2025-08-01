import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const _URL = 'http://10.72.86.217:5000';
const screenWidth = Dimensions.get('window').width;

const Profiles = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  } catch (error) {
    Alert.alert('Error', 'No se pudo cerrar sesión');
  }
};

  const renderItem = ({ item }) => {

    let mainIcon = 'person-outline'; 
    let iconColor = '#0077B6'; 


    let roleIcon = 'people-outline';
    let roleIconColor = '#00B4D8';

    if (item.role === 'admin') {
      mainIcon = 'trophy-outline';
      iconColor = '#FFD700'; 
      roleIcon = 'shield-checkmark-outline';
      roleIconColor = '#FF6347'; 
    }

    return (
      <View style={styles.userCard}>
        <View style={styles.info}>
          <Ionicons name={mainIcon} size={40} color={iconColor} />
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
              {item.nombre}
            </Text>
            <Text style={styles.email} numberOfLines={2} ellipsizeMode="tail">
              {item.correo}
            </Text>
            <View style={styles.roleContainer}>
              <Ionicons
                name={roleIcon}
                size={16}
                color={roleIconColor}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
                {item.role}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Perfiles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00A8E8" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.logoutButtonContainer}>
        <Text onPress={handleLogout} style={styles.logoutText}>
          Cerrar Sesión
        </Text>
      </View>
    </View>
  );
};

export default Profiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FAFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003B73',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    maxWidth: screenWidth * 0.70,
  },
  name: {
    fontSize: 18,
    color: '#003B73',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#0077B6',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#00B4D8',
  },
  logoutButtonContainer: {
    backgroundColor: '#FF5A5F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import loginImage from '../../assets/AquaSense.png';

const screenWidth = Dimensions.get('window').width;
const _URL = 'http://10.72.86.217:5000';

const Login = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // Guardar token
        await AsyncStorage.setItem('token', data.token);
        // Navegar y resetear stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Error', data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Animatable.View animation="zoomIn" delay={100} style={styles.imageWrapper}>
          <Image source={loginImage} style={styles.image} resizeMode="contain" />
        </Animatable.View>
        <Text style={styles.appName}>AquaSense</Text>
      </View>

      <Animatable.View animation="fadeInUp" delay={300} style={styles.bottomSection}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="usuario@correo.com"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="••••••••"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003B73',
  },
  topSection: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003B73',
    paddingTop: 80,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  appName: {
    color: '#E0F7FA',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bottomSection: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  label: {
    fontSize: 16,
    color: '#003B73',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00A8E8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

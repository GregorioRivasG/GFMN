import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.title}>Bienvenido a AquaSense</Text>
        <Text style={styles.description}>
        AquaSense es un sistema inteligente de monitoreo de calidad del agua que registra en tiempo real los niveles de oxígeno disuelto, pH y temperatura.
        </Text>
      </Animatable.View>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Animatable.View animation="fadeInUp" delay={300} style={styles.gallerySection}>
        <Text style={styles.sectionTitle}></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            'https://complementosparaaves.com/blog/wp-content/uploads/2024/10/Designer-4.jpeg',
            'https://pecesmarinos.es/wp-content/uploads/2023/04/peces-cirujano-naso-elegans.jpg',
            'https://www.zooplus.es/magazine/wp-content/uploads/2021/02/Goldfish.webp',
          ].map((uri, index) => (
            <View key={index} style={styles.imageCard}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500} style={styles.teamSection}>
        <Text style={styles.sectionTitle}>Equipo de Trabajo</Text>
        <Text style={styles.teamText}>
          - Mariela Vázquez González{"\n"}Líder del equipo, Frontend, IoT{"\n\n"}
          - Fernanda Ríos Corrales{"\n"}Frontend, IoT{"\n\n"}
          - Norberto Hernández Ramírez{"\n"}Backend, IoT{"\n\n"}
          - Gregorio Rivas García{"\n"}Backend, IoT
        </Text>
      </Animatable.View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 30,
    backgroundColor: '#003B73',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: '#E0F7FA',
    fontSize: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#00A8E8',
    margin: 25,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#003B73',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  gallerySection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#003B73',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageCard: {
    width: 240,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#E0F7FA',
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  teamSection: {
    marginTop: 30,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  teamText: {
    fontSize: 16,
    color: '#0077B6',
    lineHeight: 26,
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
  },
});

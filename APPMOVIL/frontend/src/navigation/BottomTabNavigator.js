

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/Home';
import Alerts from '../screens/Alerts';
import History from '../screens/History';
import FishTanks from '../screens/FishTanks';
import Profiles from '../screens/Profiles';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Peceras" 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Peceras') iconName = 'fish-outline';
          else if (route.name === 'Alertas') iconName = 'warning-outline';
          else if (route.name === 'Informes') iconName = 'document-text-outline';
          else if (route.name === 'Perfiles') iconName = 'people-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#44E0D0',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Peceras" component={FishTanks} />
      <Tab.Screen name="Alertas" component={Alerts} />
      <Tab.Screen name="Informes" component={History} />
      <Tab.Screen name="Perfiles" component={Profiles} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

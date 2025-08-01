

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/Home'; 
import Login from '../screens/Login';
import FishTanks from '../screens/FishTanks';
import FishTankDetail from '../screens/FishTankDetail';
import AlertDetail from '../screens/AlertDetail';
import ReportDetail from '../screens/ReportDetail';
import Profiles from '../screens/Profiles';
import BottomTabNavigator from './BottomTabNavigator'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Welcome" component={WelcomeScreen} />


        <Stack.Screen name="Login" component={Login} />


        <Stack.Screen name="FishTanks" component={FishTanks} options={{ title: 'Peceras' }} />
        <Stack.Screen name="FishTankDetail" component={FishTankDetail} options={{ title: 'Detalle de Pecera' }} />
        <Stack.Screen name="AlertDetail" component={AlertDetail} />
        <Stack.Screen name="ReportDetail" component={ReportDetail} />
        <Stack.Screen name="Profiles" component={Profiles} />


        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

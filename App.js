import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import HomeScreen from './screens/HomeScreen';
import ClassScreen from './screens/ClassScreen';
import LoginScreen from './screens/LoginScreen';
import ProfilScreen from './screens/ProfilScreen';
import TchatScreen from './screens/TchatScreen';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Home') {
          iconName = 'house';
        } else if (route.name === 'Class') {
          iconName = 'children';
        } else if (route.name === 'Tchat') {
          iconName = 'message';
        } else if (route.name === 'Profil') {
          iconName = 'user';
        }

        return <FontAwesome name={iconName} size={size} color={color} solid />;
      },
      tabBarActiveTintColor: '#4A7B59',
      tabBarInactiveTintColor: '#FFF',
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: '#67AFAC' }
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Class" component={ClassScreen} />
      <Tab.Screen name="Tchat" component={TchatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Screen" component={ClassScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



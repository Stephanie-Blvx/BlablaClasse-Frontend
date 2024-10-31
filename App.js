import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from '@expo-google-fonts/open-sans';

// SCREENS
import HomeScreen from './screens/HomeScreen.js';
import ClassScreen from './screens/ClassScreen';
import LoginParentScreen from './screens/LoginParentScreen';
import ProfilScreen from './screens/ProfilScreen';
import ProfilKidScreen from './screens/ProfilKidScreen';
import ProfilParentScreen from './screens/ProfilParentScreen';
import TchatScreen from './screens/TchatScreen.js';
import QRreaderScreen from './screens/QRreaderScreen.js';
import TeacherClassScreen from './screens/TeacherClassScreen'
import LoginTeacherScreen from './screens/LoginTeacherScreen.js';

//REDUCERS
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import parent from './reducers/parent';
import teacher from './reducers/teacher.js'
import event from './reducers/event';
import menu from './reducers/menu'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    event,
    parent,
    teacher,
  },
  reducer: { event, parent, menu },
});

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "house";
          } else if (route.name === "Class") {
            iconName = "children";
          } else if (route.name === "Tchat") {
            iconName = "message";
          } else if (route.name === "Profil") {
            iconName = "user";
          }

          return (
            <FontAwesome name={iconName} size={size} color={color} solid />
          );
        },
        tabBarActiveTintColor: "#4A7B59",
        tabBarInactiveTintColor: "#FFF",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#67AFAC" },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Class" component={ClassScreen} />
      <Tab.Screen name="Tchat" component={TchatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  // Charger les polices
  const [fontsLoaded] = useFonts({
    // Montserrat Variations
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,

    // Open Sans Variations
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  });

  // Attendre le chargement des polices avant de rendre l'application
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginParent" component={LoginParentScreen} /> 
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="ProfilParent" component={ProfilParentScreen} />
          <Stack.Screen name="ProfilKid" component={ProfilKidScreen} />
          <Stack.Screen name="QRreader" component={QRreaderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

import React from 'react';
// --------------------------------- Importation des composants navigation ---------------------------------
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// --------------------------------- Importation des composants redux ---------------------------------
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


// --------------------------------- Importation des reducers ---------------------------------
import parent from './reducers/parent';
import teacher from './reducers/teacher';


// --------------------------------- Importation des screens ---------------------------------
import IdentificationScreen from './screens/IdentificationScreen';
import ParentHomeScreen from './screens/ParentHomeScreen';
import LoginParentScreen from './screens/LoginParentScreen';
import LoginTeacherScreen from './screens/LoginTeacherScreen';
import ParentClassScreen from './screens/ParentClassScreen';
import TeacherClassScreen from './screens/TeacherClassScreen';
import ProfilScreen from './screens/ProfilScreen';
import ProfilKidScreen from './screens/ProfilKidScreen';
import ProfilParentScreen from './screens/ProfilParentScreen';
import QRreaderScreen from './screens/QRreaderScreen';
import TeacherHomeScreen from './screens/TeacherHomeScreen';
import ProfilTeacherScreen from './screens/ProfilTeacherScreen';
import ChatScreen from './screens/ChatScreen';
// --------------------------------- Importation des icônes ---------------------------------
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
// --------------------------------- Importation des polices ---------------------------------
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {  Montserrat_100Thin,  Montserrat_200ExtraLight, 
 Montserrat_300Light,  Montserrat_400Regular, 
 Montserrat_500Medium,  Montserrat_600SemiBold, 
 Montserrat_800ExtraBold,  Montserrat_900Black,} from '@expo-google-fonts/montserrat';
import {  OpenSans_300Light,  OpenSans_400Regular, 
 OpenSans_600SemiBold,  OpenSans_700Bold,  OpenSans_800ExtraBold,} from '@expo-google-fonts/open-sans';

 
const Stack = createNativeStackNavigator(); // Création d'un StackNavigator pour gérer la navigation entre les écrans
const Tab = createBottomTabNavigator(); // Création d'un TabNavigator pour gérer la navigation entre les onglets

// --------------------------------- Store ---------------------------------

const store = configureStore({
  reducer: {
   
    parent,
    teacher,
    
  },
});


// --------------------------------- ParentTabNavigator ---------------------------------
const ParentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'ParentHome') {
            iconName = 'house';
          } else if (route.name === 'ParentClass') {
            iconName = 'children';
          } else if (route.name === 'ChatScreen') {
            iconName = 'message';
          } else if (route.name === 'Profil') {
            iconName = 'user';
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
      <Tab.Screen name="ParentHome" component={ParentHomeScreen} />
      <Tab.Screen name="ParentClass" component={ParentClassScreen} />
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

// --------------------------------- TeacherTabNavigator ---------------------------------
const TeacherTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'TeacherHome') {
            iconName = 'house';
          } else if (route.name === 'TeacherClass') {
            iconName = 'children';
          } else if (route.name === 'ChatScreen') {
            iconName = 'message';
          } else if (route.name === 'ProfilTeacher') {
            iconName = 'user';
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
      <Tab.Screen name="TeacherHome" component={TeacherHomeScreen} />
      <Tab.Screen name="TeacherClass" component={TeacherClassScreen} />
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="ProfilTeacher" component={ProfilTeacherScreen} />
    </Tab.Navigator>
  );
};

// --------------------------------- StackNavigators Parent ---------------------------------
const ParentStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Identification" component={IdentificationScreen} /> */}
      <Stack.Screen name="LoginParent" component={LoginParentScreen} />
      <Stack.Screen name="ParentTabNavigator" component={ParentTabNavigator} />
      <Stack.Screen name="ProfilParent" component={ProfilParentScreen} />
      <Stack.Screen name="ProfilKid" component={ProfilKidScreen} />
      {/* <Stack.Screen name="QRreader" component={QRreaderScreen} /> */}
    </Stack.Navigator>
  );
};


//  --------------------------------- StackNavigators Teacher ---------------------------------
const TeacherStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Identification" component={IdentificationScreen} /> */}
      <Stack.Screen name="LoginTeacher" component={LoginTeacherScreen} />
      <Stack.Screen name="TeacherTabNavigator" component={TeacherTabNavigator} />
      {/* <Stack.Screen name="QRreader" component={QRreaderScreen} /> */}
    </Stack.Navigator>
  );
};


// --------------------------------- AppNavigator ---------------------------------
const AppNavigator = () => {
  const parentUserType = useSelector((state) => state.parent.value.userType);
  const teacherUserType = useSelector((state) => state.teacher.value.userType);
  console.log('userTypeParent:', parentUserType);
  console.log('userTypeTeacher:', teacherUserType);

  // const userType = parentUserType || teacherUserType;
  const userType = (parentUserType || teacherUserType || '').toLowerCase();

  console.log('userType:', userType);

 
  return ( // NavigationContainer pour gérer la navigation dans l'application 
    <NavigationContainer>
      {userType === 'parent' ? (
        <ParentStackNavigator />
      ) : userType === 'teacher' ? (
        <TeacherStackNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Identification" component={IdentificationScreen} />
          <Stack.Screen name="QRreader" component={QRreaderScreen} />
          <Stack.Screen name="ParentTabNavigator" component={ParentTabNavigator} />
          <Stack.Screen name="TeacherTabNavigator" component={TeacherTabNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />; 
  }

  return (
    
    <Provider store={store}> 
      <AppNavigator />  
    </Provider>
  );
}
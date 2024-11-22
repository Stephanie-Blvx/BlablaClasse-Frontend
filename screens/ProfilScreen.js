import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/parent.js";

import FontAwesome from "react-native-vector-icons/FontAwesome6";

// Composant principal pour l'écran de profil
export default function ProfilScreen({ navigation }) {
  const dispatch = useDispatch(); // Dispatch pour appeler les actions du reducer

  // Fonction de déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          onPress: () => {
            dispatch(logout()); // Dispatcher l'action logout
            navigation.navigate('Identification'); // Naviguer vers l'écran d'identification
          }
        }
      ],
      { cancelable: false }
    );
  };
  //-------------------------------------------------JSX------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
  <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
  <View style={globalStyles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.backButton}>
      <Text style={globalStyles.backText}>←</Text> 
    </TouchableOpacity>
    <Text style={globalStyles.headerTitle}>Profil</Text>
  </View>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={40}
  >
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <View style={buttonStyles.buttonContainer}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => navigation.navigate("ProfilParent")}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.buttonText}>Mon profil parent</Text>
          </TouchableOpacity>
        </View>
        <View style={buttonStyles.buttonContainer}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => navigation.navigate("ProfilKid")}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.buttonText}>Le profil de mon enfant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    {/* Bouton de déconnexion fixe en bas */}
    <View style={buttonStyles.logoutContainer}>
      <TouchableOpacity
        style={buttonStyles.logoutButton}
        onPress={handleLogout}
      >
         <FontAwesome name="right-from-bracket" size={20} color="#4A7B59" solid />
        <Text style={[buttonStyles.buttonText, buttonStyles.buttonTextLogout, buttonStyles.logouttext]}>
          Deconnexion
        </Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
  );
}

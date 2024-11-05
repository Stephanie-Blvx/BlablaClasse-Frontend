import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
    dispatch(logout()); // Appel de la fonction logout du reducer parent
    navigation.navigate("Identification"); // Naviguer vers l'écran de connexion
    console.log("parent déconnecté"); //    Pour le débogage
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
    <View style={styles.logoutContainer}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
         <FontAwesome name="right-from-bracket" size={20} color="#4A7B59" solid />
        <Text style={[buttonStyles.buttonText, buttonStyles.buttonTextLogout, styles.logouttext]}>
          Deconnexion
        </Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#67AFAC',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 4,
  },
  backButton: {
    marginRight: 0,
  },
  backText: {
    color: '#fff',
    fontSize: 28,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    flex: 0.9,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espace entre le contenu et le bouton de déconnexion
  },
  logoutContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fcfe',
    paddingVertical: 15,
    borderRadius: 8,
    width: 200,
  },
  logouttext: {
      fontFamily: "OpenSans_700Bold",
      color: "#121212",
      fontSize: 18,
      marginLeft: 10,
  }
});

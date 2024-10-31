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

// Composant principal pour l'écran de profil
export default function ProfilScreen({ navigation }) {
  const dispatch = useDispatch(); // Dispatch pour appeler les actions du reducer

  // Fonction de déconnexion
  const handleLogout = () => {
    dispatch(logout()); // Appel de la fonction logout du reducer parent
    navigation.navigate("LoginParent"); // Naviguer vers l'écran de connexion
    console.log("parent déconnecté"); //    Pour le débogage
  };

  //-------------------------------------------------JSX------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#8DBFA9" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Profil</Text>
            {}
            <View style={buttonStyles.buttonContainer}>
              {/* Bouton de validation du formulaire */}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => navigation.navigate("ProfilParent")} //naviguer vers page ProfileParent
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>Profil Parent</Text>
                </TouchableOpacity>
              </View>
              {/* Bouton de validation du formulaire */}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => navigation.navigate("ProfilKid")} //naviguer vers page ProfileKid
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>Profil Enfant</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Bouton de déconnexion */}
            <View
              style={[
                buttonStyles.buttonContainer,
                buttonStyles.buttonContainerlogout,
              ]}
            >
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => handleLogout()} // Appeler la fonction de déconnexion
              >
                <Text
                  style={[
                    buttonStyles.buttonText,
                    buttonStyles.buttonTextLogout,
                  ]}
                >
                  Deconnexion
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

// Composant principal pour l'écran de profil
export default function ProfilScreen({navigation}) {
  // États pour gérer les valeurs des champs de formulaire

  // Fonction de validation du formulaire
  const handleLogOut = () => {
    // Logique de validation ou envoi des données
    console.log("Déconnexion");
  };

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

            {/* Bouton de validation du formulaire */}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('ProfilParent')} //naviguer vers page ProfileParent lorsqu'on l'aura
                activeOpacity={.8}
              >
                <Text style={buttonStyles.buttonText}>Profil Parent</Text>
              </TouchableOpacity>
            </View>

            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('ProfilKid')} //naviguer vers page ProfileKid lorsqu'on l'aura
                activeOpacity={.8}
              >
                <Text style={buttonStyles.buttonText}>Profil Enfant</Text>
              </TouchableOpacity>
            </View>

            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={handleLogOut}
                activeOpacity={.8}
              >
                <Text style={buttonStyles.buttonText}>Deconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

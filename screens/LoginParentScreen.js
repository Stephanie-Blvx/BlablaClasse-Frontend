import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/parent";

import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

import AsyncStorage from '@react-native-async-storage/async-storage';


const BACKEND_ADDRESS = "https://blabla-classe-backend.vercel.app"; //-------> url Backend

// email Regex
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LoginParentScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const parent = useSelector((state) => state.parent.value);

  // Fonction pour gérer la connexion
  function handleConnexion() {
    if (!isLoading) {
      // si pas de chargement
      setIsLoading(true); // démarrer le chargement
      if (!emailRegex.test(email)) {
        // si email invalide
        setIsValidEmail(false); // si email invalide, message erreur
        setIsLoading(false); // arrêter le chargement
        return;
      }
    }
    fetch(
      `${BACKEND_ADDRESS}/parents/signin`, // requête POST vers la route /parents/signin
      {
        method: "POST", // méthode POST
        headers: { "Content-Type": "application/json" }, // type de contenu
        body: JSON.stringify({
          // données à envoyer
          email: email, // email et password
          password: password, // email et password
        }),
      }
    )
      .then((response) => {
        console.log("Réponse brute:", response); // Log de la réponse brute
        return response.json();
      }) // récupérer la réponse en json
      .then((dbData) => {
        // récupérer les données de la base
        console.log("dbData", dbData); // afficher la réponse de la route / dataBase
        if (!dbData.result) {
          // si result : false, message erreur email
          setIsValidEmail(false);
        } else {
          // si result : true
          console.log('dbData', dbData); // afficher les données de la base
          AsyncStorage.setItem('accessToken', dbData.accessToken)
            .then(() => {
              console.log('Token JWT stocké:', dbData.accessToken);
            })
      
            .then(() => {
              console.log('Token de la BDD stocké:', dbData.token);
              dispatch(
                login(dbData) // dispatch de l'action login
              ); // si result = OK, MàJ reducer "parent" avec token et email et kids
              console.log('Dispatch effectué');
              navigation.navigate("ParentTabNavigator");
              console.log('Navigation effectuée');
            })
            .catch((error) => {
              console.error('Erreur lors du stockage des tokens:', error);
              Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
            });
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion:', error);
        Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false); // arrêter le chargement
      });
  }

  console.log("parent", parent); //afficher les données du store

  //-------------------------------------------------JSX------------------------------------------
  return (
    // contenu de la page = mainContainer
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitleNoReturn}>Se connecter</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
        

{/* RETRAIT ICI DU QR CODE SCREEN   */}

            {!isValidEmail && (
              <Text style={globalStyles.errorMessage}>
                Email ou mot de passe invalide, veuillez réessayer
              </Text>
            )}
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                    Email
              </Text>
              <TextInput //champ d'input email
                style={[
                  buttonStyles.input,
                  !isValidEmail && { borderColor: "red", borderWidth: 1 },
                ]}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                onChangeText={(value) => setEmail(value)}
                value={email}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                    Mot de passe
              </Text>
              <TextInput //champ d'input password
                style={[
                  buttonStyles.input,
                  !isValidEmail && { borderColor: "red", borderWidth: 1 },
                ]}
                placeholder="Password"
                onChangeText={(value) => setPassword(value)}
                value={password}
                placeholderTextColor="#5e5e5e8a"
                secureTextEntry={true}
              />
              <TouchableOpacity>
                <Text style={buttonStyles.forgotPassword}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity //champ cliquable renvoi vers QRCode scanner
                style={buttonStyles.button}
                onPress={() => handleConnexion()}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonText}>
                  {isLoading ? "Chargement..." : "Connexion"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* </View > */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

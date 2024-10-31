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
import { login, logout } from "../reducers/parent.js";

import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

// const BACKEND_ADDRESS = "http://192.168.5.28:3000"; //-------> url Backend
const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //-------> url Backend

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
      .then((response) => response.json()) //récupérer la réponse en json
      .then((dbData) => {
        // récupérer les données de la base
        console.log("dbData", dbData); // afficher la réponse de la route / dataBase
        if (!dbData.result) {
          // si result : false, message erreur email
          setIsValidEmail(false);
        } else {
          // si result : true
          console.log(dbData); //afficher les données de la base
          dispatch(
            login({
              //dispatch de l'action login
              token: dbData.token,
              email: dbData.email,
              firstname: dbData.firstname,
              lastname: dbData.lastname,
              kids: dbData.kids,
              id: dbData.id,
              userType: dbData.userType,
            })
          ); //si result = OK, MàJ reducer "parent" avec token et email et kids
          navigation.navigate("TabNavigator");
        }
      });
  }
  console.log("parent", parent); //afficher les données de la base

  //-------------------------------------------------JSX------------------------------------------
  return (
    // contenu de la page = mainContainer
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
            <Text style={globalStyles.title}>Se connecter</Text>

            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity //champ cliquable renvoi vers QRCode scanner
                style={buttonStyles.transparentButton}
                onPress={() => navigation.navigate('QRreader')} //naviguer vers page QRCodeScanner
              >
                <Text style={buttonStyles.input}>Je scanne un QR Code</Text>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.dividerContainer}>
              <View style={globalStyles.line} />
              <Text style={globalStyles.orText}>OU</Text>
              <View style={globalStyles.line} />
            </View>

            {!isValidEmail && (
              <Text style={buttonStyles.error}>
                Email ou mot de passe invalide, veuillez réessayer
              </Text>
            )}
            <View style={buttonStyles.inputContainer}>
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

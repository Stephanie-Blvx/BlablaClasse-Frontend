import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, TouchableOpacity, StatusBar, } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../reducers/teacher.js";
  
import { buttonStyles } from "../styles/buttonStyles.js";
import { globalStyles } from "../styles/globalStyles.js";
  
  // const BACKEND_ADDRESS = "http://192.168.5.28:3000"; //-------> url Backend
  const BACKEND_ADDRESS = "http://localhost:3000"; //-------> url Backend
  
  // email Regex
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
  
    const dispatch = useDispatch();
    const teacher = useSelector((state) => state.teacher.value);
  
    function handleConnexion() {
      // if (!emailRegex.test(email)) {
      //   setIsValidEmail(false);
      //   return;
      // }
      if (!isLoading) {
        setIsLoading(true);
        if (!emailRegex.test(email)) {
          setIsValidEmail(false);
          setIsLoading(false);
          return;
        }
      }
      fetch(
        `${BACKEND_ADDRESS}/teachers/signin`, // fetch route teachers/signin
  
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      )
        .then((response) => response.json())
        .then((dbData) => {
          console.log("dbData", dbData); // afficher la réponse de la route / dataBase
          if (!dbData.result) {
            setIsValidEmail(false);
          } //si result : false, message erreur email
          else {
            console.log(dbData);
            dispatch(login({ token: dbData.token, email: dbData.email, firstname: dbData.firstname, lastname: dbData.lastname, username: dbData.username, classes: dbData.classes, id: dbData.id})); //si result = OK, MàJ reducer "parent" avec token et email et kids
            navigation.navigate("TabNavigator");
          }
        });
    }
  
    console.log(teacher)
    //-------------------------------------------------JSX------------------------------------------
    return (
        <SafeAreaView style={globalStyles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#8DBFA9" />
    
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={40}
          >
            <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
              <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Profil</Text>
    
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
                  <TextInput
                    style={[buttonStyles.input, !isValidEmail && { borderColor: "red", borderWidth: 1 }]}
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
                  <TextInput
                    style={[buttonStyles.input, !isValidEmail && { borderColor: "red", borderWidth: 1 }]}
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
                  <TouchableOpacity
                    style={buttonStyles.button}
                    onPress={() => handleConnexion()}
                    activeOpacity={0.8}
                  >
                    <Text style={buttonStyles.buttonText}>
                      {isLoading ? 'Chargement...' : 'Connexion'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }

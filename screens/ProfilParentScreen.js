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
  StatusBar,
  Modal,
} from "react-native";
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { updateEmail } from "../reducers/parent";
import AsyncStorage from "@react-native-async-storage/async-storage";

 const BACKEND_ADDRESS = "https://blabla-classe-backend.vercel.app"; //-------> url Backend


const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Composant principal pour l'écran de profil
export default function ProfilParentScreen({ navigation }) {
  // États pour gérer les valeurs des champs de formulaire et modales
  const [firstname, setFirstname] = useState(""); // Ajouter un état pour le prénom du parent
  const [lastname, setLastname] = useState(""); //    Ajouter un état pour le nom du parent
  const [emailModalVisible, setEmailModalVisible] = useState(false); // Ajouter un état pour le modal de l'email
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // Ajouter un état pour le modal du mot de passe
  const [newEmail, setNewEmail] = useState(""); //  Ajouter un état pour le nouvel email
  const [currentPassword, setCurrentPassword] = useState(""); // Ajouter un état pour le mot de passe actuel
  const [newPassword, setNewPassword] = useState(""); // Ajouter un état pour le nouveau mot de passe
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(""); // Ajouter un état pour le message d'erreur de l'email
  const [emailSuccessMessage, setEmailSuccessMessage] = useState(""); // Message de succès pour l'email
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(""); // Message de succès pour le mot de passe

  // Accéder aux informations du parent connecté depuis le Redux store
  const parent = useSelector((state) => state.parent.value); // Récupère les informations du parent
  console.log(parent); // Affiche les informations du parent

  const dispatch = useDispatch(); // Dispatch pour mettre à jour les informations du parent

  //----------------------------------------------- Fonction pour changer le mot de passe ------------------------------------------------
  const handleChangePassword = async () => {
    console.log("Appel de la fonction handleChangePassword");

    // Récupérer le token JWT stocké dans AsyncStorage
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      setError("Token is undefined"); // Afficher un message d'erreur
      console.log("Token is undefined");
      return;
    }

    console.log("Token JWT", token); // Pour le débogage

    const parentId = parent.id; // Récupérez l'ID du parent depuis le Redux store
    console.log("Parent ID:", parentId); // Pour le débogage

    const payload = {
      parentId: parentId, // ID du parent récupéré
      currentPassword: currentPassword, // Le mot de passe actuel
      newPassword: newPassword, // Le nouveau mot de passe
    };

    console.log("Payload pour le changement de mot de passe :", payload);

    const requestOptions = {
      method: "PUT", // Méthode HTTP PUT
      headers: {
        "Content-Type": "application/json", // Type de contenu
        Authorization: `Bearer ${token}`, // Token d'authentification
      },
      body: JSON.stringify(payload), // Convertit l'objet en chaîne JSON
    };

    console.log("Requête pour le changement de password :", requestOptions); // Pour le débogage
    fetch(`${BACKEND_ADDRESS}/parents/change-password`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Changement réussi:", data.message);
          setCurrentPassword("");
          setPasswordSuccessMessage("Mot de passe changé avec succès !");
          setTimeout(() => {
            setNewPassword("");
            setPasswordModalVisible(false);
            setPasswordSuccessMessage("");
          }, 2000); // Augmenter le délai pour voir le message
        } else {
          // console.error("Erreur lors du changement de mot de passe :", data.error);
          console.error(
            "Erreur lors du changement de mot de passe :",
            error.message || "Erreur non spécifiée"
          );
          setError(data.error || "Une erreur est survenue.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
        setError("Une erreur est survenue.");
      });
  };

  //----------------------------------------------- Fonction pour changer l'email ------------------------------------------------
  const handleChangeEmail = () => {
    console.log("Nouvel email :", newEmail); // Vérifiez la valeur ici

    if (!newEmail || !emailRegex.test(newEmail)) {
      setEmailError("L'adresse e-mail est invalide."); // Définit le message d'erreur
      console.error("L'adresse e-mail est invalide."); // Pour le débogage
      return;
    } else {
      setEmailError(""); // Réinitialise le message d'erreur si l'email est valide
    }

    const token = parent.token; // Assurez-vous que le token est présent

    if (!token) {
      console.error("Token is undefined"); // Pour le débogage
      return; // Ou montrez un message d'erreur à l'utilisateur
    }

    const parentId = parent.id; // Récupérez l'ID du parent depuis le Redux store
    console.log("Parent ID:", parentId);

    const payload = {
      parentId: parent.id, // ID du parent récupéré
      newEmail: newEmail, // Le nouvel email
    };

    console.log("Payload pour le changement d'email:", payload); // Pour le débogage

    const requestOptions = {
      method: "PUT", // Méthode HTTP PUT
      headers: {
        "Content-Type": "application/json", // Type de contenu
        Authorization: `Bearer ${token}`, // Token d'authentification
      },
      body: JSON.stringify(payload), // Convertit l'objet en chaîne JSON
    };

    console.log("Requête pour le changement d'email:", requestOptions); // Pour le débogage
    fetch(`${BACKEND_ADDRESS}/parents/change-email`, requestOptions) // Appel de l'API
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          dispatch(updateEmail(newEmail));
          //setEmailModalVisible(false);
          setEmailSuccessMessage("Email changé avec succès !");
          setTimeout(() => {
            setNewEmail("");
            setEmailModalVisible(false);
            setEmailSuccessMessage("");
          }, 1000); // Modal fermée après 3 secondes
        } else {
          console.error("Erreur :", data.error);
        }
      });
  };

  //-------------------------------------------- JSX ----------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.backButton}
        >
          <Text style={globalStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Mon profil</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                    Prénom
              </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Prénom du parent"
                value={parent.firstname || ""}
                onChangeText={setFirstname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                    Nom
              </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom du parent"
                value={parent.lastname || ""}
                onChangeText={setLastname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                    Email
              </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Email du parent"
                value={parent.email || ""}
                onChangeText={setNewEmail}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Bouton pour changer l'email */}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={[buttonStyles.button, buttonStyles.buttonSecondary]}
                onPress={() => setEmailModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonText}>Changer mon email</Text>
              </TouchableOpacity>
            </View>

            {/* Modal pour changer l'email */}
            <Modal
              transparent={true}
              visible={emailModalVisible}
              onRequestClose={() => setEmailModalVisible(false)}
              animationType="slide"
            >
              <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                <View style={buttonStyles.buttonContainer}>
                  <Text style={buttonStyles.label}>
                    Taper votre nouvel email
                  </Text>
                  <TextInput
                    style={buttonStyles.input}
                    placeholder="Nouveau email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholderTextColor="#5e5e5e8a"
                  />
                  </View>
                  {/* Affichage du message d'erreur pour l'email */}
                  {emailError ? (
                    <Text style={globalStyles.errorMessage}>{emailError}</Text>
                  ) : null}
                  {emailSuccessMessage ? (
                    <Text style={globalStyles.successMessage}>
                      {emailSuccessMessage}
                    </Text>
                  ) : null}
                  <View style={buttonStyles.buttonContainer}>
                    <TouchableOpacity
                      style={buttonStyles.button}
                      onPress={() => {
                        handleChangeEmail();
                        //setEmailModalVisible(false);
                      }}
                    >
                      <Text style={buttonStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={buttonStyles.cancelButton}
                      onPress={() => setEmailModalVisible(false)}
                    >
                      <Text style={buttonStyles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Bouton pour changer le mot de passe */}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => setPasswordModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonText}>
                  Changer mon mot de passe
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal pour changer le mot de passe */}
            <Modal
              transparent={true}
              visible={passwordModalVisible}
              onRequestClose={() => setPasswordModalVisible(false)}
              animationType="slide"
            >
              <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                  {/* <Text style={globalStyles.modalTitle}>
                    Changer le mot de passe
                  </Text> */}

                  <View style={buttonStyles.buttonContainer}>
                    <Text style={buttonStyles.label}>
                      Taper votre ancien mot de passe
                    </Text>
                    <TextInput
                      style={buttonStyles.input}
                      placeholder="Mot de passe actuel"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={true}
                      placeholderTextColor="#5e5e5e8a"
                    />
                  </View>
                  <View style={buttonStyles.buttonContainer}>
                    <Text style={buttonStyles.label}>
                      Taper votre nouveau mot de passe
                    </Text>
                    <TextInput
                      style={buttonStyles.input}
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={true}
                      placeholderTextColor="#5e5e5e8a"
                    />
                    {error ? (
                      <Text style={globalStyles.errorMessage}>{error}</Text>
                    ) : null}
                    {passwordSuccessMessage ? (
                      <Text style={globalStyles.successMessage}>
                        {passwordSuccessMessage}
                      </Text>
                    ) : null}
                  </View>
                  <View style={buttonStyles.buttonContainer}>
                    <TouchableOpacity
                      style={buttonStyles.button}
                      onPress={() => {
                        handleChangePassword();
                        //setPasswordModalVisible(false);
                      }}
                    >
                      <Text style={buttonStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={buttonStyles.cancelButton}
                      onPress={() => setPasswordModalVisible(false)}
                    >
                      <Text style={buttonStyles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

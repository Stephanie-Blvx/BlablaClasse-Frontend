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
import { updateEmail, logout } from "../reducers/teacher";

const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //-------> url Backend
//const BACKEND_ADDRESS = "http://localhost:3000"; //-------> url Backend

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Composant principal pour l'écran de profil
export default function ProfilTeacherScreen({ navigation }) {
  // États pour gérer les valeurs des champs de formulaire et modales
  const [firstname, setFirstname] = useState(""); // Ajouter un état pour le prénom du teacher
  const [lastname, setLastname] = useState(""); //    Ajouter un état pour le nom du teacher
  const [emailModalVisible, setEmailModalVisible] = useState(false); // Ajouter un état pour le modal de l'email
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // Ajouter un état pour le modal du mot de passe
  const [newEmail, setNewEmail] = useState(""); //  Ajouter un état pour le nouvel email
  const [currentPassword, setCurrentPassword] = useState(""); // Ajouter un état pour le mot de passe actuel
  const [newPassword, setNewPassword] = useState(""); // Ajouter un état pour le nouveau mot de passe
  const [emailError, setEmailError] = useState(""); // Ajouter un état pour le message d'erreur de l'email

  // Accéder aux informations du teacher connecté depuis le Redux store
  const teacher = useSelector((state) => state.teacher.value); // Récupère les informations du teacher
  console.log(teacher); // Affiche les informations du teacher

  const dispatch = useDispatch(); // Dispatch pour mettre à jour les informations du teacher


    // Fonction de déconnexion
    const handleLogout = () => {
      dispatch(logout()); // Appel de la fonction logout du reducer parent
      navigation.navigate("Identification"); // Naviguer vers l'écran de connexion
      console.log("teacher déconnecté"); //    Pour le débogage
    };

  //---------------------- Fonction pour changer le mot de passe ------------------------------------------------------------------
  const handleChangePassword = () => {
    const token = teacher.token; // Assurez-vous que le token est présent
    if (!token) {
      // Vérifiez si le token est présent
      console.error("Token is undefined"); // Pour le débogage
      return; // Ou montrez un message d'erreur à l'utilisateur
    }

    const teacherId = teacher.id; // Récupérez l'ID du teacher depuis le Redux store
    console.log("teacher ID:", teacherId); // Pour le débogage

    const payload = {
      teacherId: teacherId, // ID du teacher récupéré
      currentPassword: currentPassword, // Le mot de passe actuel
      newPassword: newPassword, // Le nouveau mot de passe
    };

    console.log("Payload pour le changement de mot de passe:", payload); // Pour le débogage

    const requestOptions = {
      method: "PUT", // Méthode HTTP PUT
      headers: {
        // En-têtes de la requête
        "Content-Type": "application/json", // Type de contenu
        Authorization: `Bearer ${token}`, // Token d'authentification
      },
      body: JSON.stringify(payload), // Convertit l'objet en chaîne JSON
    };

    fetch(`${BACKEND_ADDRESS}/teachers/change-password`, requestOptions) // Appel de l'API
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Récupère les données
        console.log("Réponse du serveur:", data); // Affiche la réponse complète
        if (data.result) {
          // Si la réponse est positive
          // Optionnel : Réinitialiser les champs ou montrer un message de succès
          setCurrentPassword(""); // Réinitialiser le mot de passe actuel
          console.log(
            "currentPassword après réinitialisation:",
            currentPassword
          ); // Vérifie la valeur
          setNewPassword(""); // Réinitialiser le nouveau mot de passe
          setPasswordModalVisible(false); // Ferme le modal
        } else {
          // Si la réponse est négative
          console.error(data.error); // Affiche l'erreur
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la modification du mot de passe:", error); // Gestion des erreurs
      });
  };

  //----------------------------------------------- Fonction pour changer le mot de passe ------------------------------------------------
  const handleChangeEmail = () => {
    console.log("Nouvel email :", newEmail); // Vérifiez la valeur ici

    if (!newEmail || !emailRegex.test(newEmail)) {
      setEmailError("L'adresse e-mail est invalide."); // Définit le message d'erreur
      console.error("L'adresse e-mail est invalide."); // Pour le débogage
      return;
    } else {
      setEmailError(""); // Réinitialise le message d'erreur si l'email est valide
    }

    const token = teacher.token; // Assurez-vous que le token est présent
    if (!token) {
      console.error("Token is undefined"); // Pour le débogage
      return; // Ou montrez un message d'erreur à l'utilisateur
    }

    const teacherId = teacher.id; // Récupérez l'ID du teacher depuis le Redux store
    console.log("Teacher ID:", teacherId);

    const payload = {
      teacherId: teacher.id, // ID du teacher récupéré
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

    fetch(`${BACKEND_ADDRESS}/teachers/change-email`, requestOptions) // Appel de l'API
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        console.log("Réponse du serveur:", data); // Affiche la réponse complète
        if (data.result) {
          dispatch(updateEmail(newEmail)); // Met à jour l'email dans le Redux store
          setNewEmail(""); // Réinitialise le nouvel email
          setEmailModalVisible(false); // Ferme le modal
        } else {
          console.error(data.error); // Affiche l'erreur
        }
      })
      .catch((error) => {
        console.error("Erreur lors du changement d'email:", error); // Gestion des erreurs
      });
  };

  //-------------------------------------------- JSX ----------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Profil Enseignant</Text>
            {/* <View style={globalStyles.lineTitle} /> */}

            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Prénom de l'enseignant"
                value={teacher.firstname || ""}
                onChangeText={setFirstname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom de l'enseignant"
                value={teacher.lastname || ""}
                onChangeText={setLastname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Email de l'enseignant"
                value={teacher.email || ""}
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
                <Text style={buttonStyles.buttonText}>Changer son email</Text>
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
                  <TextInput
                    style={buttonStyles.input}
                    placeholder="Nouveau email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholderTextColor="#5e5e5e8a"
                  />
                  {/* Affichage du message d'erreur pour l'email */}
                  {emailError ? (
                    <Text style={{ color: "red", marginTop: 3 }}>
                      {emailError}
                    </Text>
                  ) : null}
                  <View style={buttonStyles.buttonContainer}>
                    <TouchableOpacity
                      style={buttonStyles.button}
                      onPress={() => {
                        handleChangeEmail();
                        setEmailModalVisible(false);
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
                  Changer son mot de passe
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
                  <Text style={globalStyles.modalTitle}>
                    Changer le mot de passe
                  </Text>
                  <View style={buttonStyles.buttonContainer}>
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
                    <TextInput
                      style={buttonStyles.input}
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={true}
                      placeholderTextColor="#5e5e5e8a"
                    />
                  </View>
                  <View style={buttonStyles.buttonContainer}>
                    <TouchableOpacity
                      style={buttonStyles.button}
                      onPress={() => {
                        handleChangePassword();
                        setPasswordModalVisible(false);
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
            <View
              style={[
                buttonStyles.buttonContainer,
                buttonStyles.buttonContainerlogout,
              ]}
            >
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => handleLogout()} 
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

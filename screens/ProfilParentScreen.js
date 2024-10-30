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
const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //-------> url Backend
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, updateEmail } from "../reducers/parent.js";
import bcrypt from "react-native-bcrypt";

// Composant principal pour l'écran de profil
export default function ProfilParentScreen() {
  // États pour gérer les valeurs des champs de formulaire et modales
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Accéder aux informations du parent connecté depuis le Redux store
  const parent = useSelector((state) => state.parent.value);
  console.log(parent);
  

  const dispatch = useDispatch(); // 


  const handleChangePassword = () => {
    console.log("Parent state:", parent); 
    const token = parent.token; 
    console.log('Token:', token);

    if (!token) {
      console.error("Token is undefined");
      return; 
    }

    const payload = {
      currentPassword,
      newPassword,
    };

    console.log("Token:", token);
    console.log("Payload:", payload);

    fetch(`${BACKEND_ADDRESS}/parents/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data.message);
          // Hacher le nouveau mot de passe avant de le dispatcher
          const hashedPassword = bcrypt.hashSync(newPassword, 10); 
          
          dispatch(updatePassword({ hashedPassword })); // Dispatcher le mot de passe haché
          setPasswordModalVisible(false);
        } else {
          console.log(data.error);
        }
      })
      .catch((error) => {
        console.error('Error updating password:', error);
      });
  };

  const handleChangeEmail = () => {
    // Vérifiez si le nouvel email est renseigné
    if (!newEmail) {
      console.error("L'adresse e-mail est requise.");
      return;
    }
  
    const token = parent.token; // Assurez-vous que le token est présent
    if (!token) {
      console.error("Token is undefined");
      return; // Ou montrez un message d'erreur à l'utilisateur
    }
  
    const payload = {
      newEmail,
    };
  
    console.log("Payload pour le changement d'email:", payload);
  
    fetch(`${BACKEND_ADDRESS}/parents/change-email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Ajoutez le token ici
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse API:", data); // Pour le débogage
        if (data.result) {
          console.log(data.message); // Message de succès
          // Mettez à jour l'état si nécessaire
          dispatch(updateEmail({ newEmail }))
          setEmailModalVisible(false); // Fermer le modal
        } else {
          console.log(data.error || "Erreur lors du changement d'email");
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l\'email:', error);
      });
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
            <Text style={globalStyles.title}>Profil parent</Text>

            <View style={buttonStyles.inputContainer}>
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
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom du parent"
                value={parent.lastname || ""}
                onChangeText={setLastname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Bouton pour changer l'email */}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
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
                  {/* <Text style={globalStyles.modalTitle}>Changer l'email</Text> */}
                  <TextInput
                    style={buttonStyles.input}
                    placeholder="Nouveau email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholderTextColor="#5e5e5e8a"
                  />
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

  // Fonction de validation du formulaire
  const handleValidation = () => {
    console.log("Formulaire validé");
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
                value={firstname}
                onChangeText={setFirstname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom du parent"
                value={lastname}
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
                        handleValidation();
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
                <Text style={buttonStyles.buttonText}>Changer son mot de passe</Text>
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
                  <Text style={globalStyles.modalTitle}>Changer le mot de passe</Text>
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
                        handleValidation();
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

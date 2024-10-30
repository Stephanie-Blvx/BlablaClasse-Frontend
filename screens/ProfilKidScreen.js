import React, { useState, useEffect } from "react";
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
const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //-------> url Backend
import { useDispatch, useSelector } from "react-redux";

// Composant principal pour l'écran de profil
export default function ProfilKidScreen({ route }) {
  const parent = useSelector((state) => state.parent.value);
  console.log(parent);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Obtenir le mois, le jour et l'année
    const monthNames = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`; // Format: jour mois année
  };

  // États pour gérer les valeurs des champs de formulaire
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthdate, setBirthdate] = useState("");
//   const [allergies, setAllergies] = useState("");
//   const [habits, setHabits] = useState("");
//   const [additionalInfo, setAdditionalInfo] = useState("");

 // États pour gérer les valeurs des champs de formulaire
 const [allergies, setAllergies] = useState(parent.kids[0].allergies || "");
 const [habits, setHabits] = useState(parent.kids[0].habits || "");
 const [additionalInfo, setAdditionalInfo] = useState(parent.kids[0].additionalInfo || "");

  // const handleValidation = () => {
  // };

  const handleValidation = () => {
    const kidId = parent.kids[0]._id; // ID de l'enfant à partir du state
    const token = parent.token; // Token d'authentification du parent

    // Vérifiez que le token est présent
    if (!token) {
      console.error("Token est manquant.");
      return;
    }

    const payload = {
      firstname: parent.kids[0].firstname, // Récupérez le prénom de l'enfant
      lastname: parent.kids[0].lastname, // Récupérez le nom de l'enfant
      birthdate: parent.kids[0].birthdate, // Récupérez la date de naissance de l'enfant
      allergies,
      habits,
      additionalInfo,
    };

    // Appel API pour envoyer les données au backend
    fetch(`${BACKEND_ADDRESS}/kids/update/${kidId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // En-tête d'autorisation avec le token
      },
      body: JSON.stringify(payload), // Envoi des données
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse API:", data); // Pour le débogage
        if (data.result) {
          console.log("Mise à jour réussie:", data.kid);
          // Vous pouvez ici ajouter des actions pour indiquer que la mise à jour a réussi
        } else {
          console.log(data.error || "Erreur lors de la mise à jour");
        }
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
            <Text style={globalStyles.title}>Profil enfant</Text>

            {/* Champ de saisie pour le prénom de l'enfant */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom de l'enfant"
                value={parent.kids[0].firstname || ""}
                onChangeText={setFirstname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Champ de saisie pour le nom de l'enfant */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Prénom de l'enfant"
                value={parent.kids[0].lastname || ""}
                onChangeText={setLastname}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Champ de saisie pour la date de naissance */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Date de naissance"
                value={formatDate(parent.kids[0].birthdate) || ""}
                onChangeText={setBirthdate}
                editable={false}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Champ de saisie pour les allergies */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={buttonStyles.input}
                placeholder="Allergies"
                value={allergies}
                onChangeText={setAllergies}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Champ de saisie pour les habitudes */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={buttonStyles.input}
                placeholder="Habitudes"
                value={habits}
                onChangeText={setHabits}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Champ de saisie pour les informations supplémentaires */}
            <View style={buttonStyles.inputContainer}>
              <TextInput
                style={buttonStyles.input}
                placeholder="Informations diverses"
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholderTextColor="#5e5e5e8a"
              />
            </View>

            {/* Bouton de validation du formulaire */}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={handleValidation}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonText}>VALIDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

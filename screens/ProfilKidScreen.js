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
  StatusBar,
  StyleSheet,
} from "react-native";
import { buttonStyles } from "../styles/buttonStyles"; // Importation des styles pour les boutons
import { globalStyles } from "../styles/globalStyles"; // Importation des styles globaux
const BACKEND_ADDRESS = "http://192.168.3.174:3000"; // URL Backend
import { useDispatch, useSelector } from "react-redux";
import { updateKidInfo } from "../reducers/parent"; // Assurez-vous d'importer l'action
import FontAwesome from "react-native-vector-icons/FontAwesome6";

// Composant principal pour l'écran de profil
export default function ProfilKidScreen({ navigation }) {
  const parent = useSelector((state) => state.parent.value); // Récupère les données parent de Redux
  const dispatch = useDispatch(); // Pour dispatcher les actions Redux
  console.log(parent);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    // Prend une chaîne de date comme argument
    const date = new Date(dateString); // Crée un objet Date à partir de la chaîne de date
    const monthNames = [
      // Noms des mois
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
    const day = date.getDate(); // Récupère le jour du mois
    const month = monthNames[date.getMonth()]; // Récupère le mois
    const year = date.getFullYear(); // Récupère l'année
    return `${day} ${month} ${year}`; // Retourne la date formatée
  };

  // États pour gérer les valeurs des champs de formulaire
  const [allergies, setAllergies] = useState(parent.kids[0].allergies || "");
  const [habits, setHabits] = useState(parent.kids[0].habits || "");
  const [additionalInfo, setAdditionalInfo] = useState(
    parent.kids[0].additionalInfo || ""
  );
  // État pour le message de succès
  const [successMessage, setSuccessMessage] = useState("");

  // useEffect est utilisé pour mettre à jour les valeurs des champs de formulaire lorsque les données de l'enfant changent dans le store Redux.
  useEffect(() => {
    // Utilisez un effet pour mettre à jour les valeurs des champs
    if (parent.kids.length > 0) {
      // Vérifiez si l'enfant est présent
      const kid = parent.kids[0]; // Récupérez les données de l'enfant
      setAllergies(kid.allergies || ""); // Met à jour les allergies
      setHabits(kid.habits || ""); // Met à jour les habitudes
      setAdditionalInfo(kid.additionalInfo || ""); //   Met à jour les informations supplémentaires
    }
  }, [parent.kids]); // Exécutez l'effet lorsque les données de l'enfant changent

  const handleValidation = () => {
    const kidId = parent.kids[0]._id; // ID de l'enfant à partir du state
    const token = parent.token; // Token d'authentification du parent

    // Vérifiez que le token est présent
    if (!token) {
      console.error("Token est manquant.");
      return;
    }

    const payload = {
      // Données à envoyer au backend
      firstname: parent.kids[0].firstname, // Récupérez le prénom de l'enfant
      lastname: parent.kids[0].lastname, // Récupérez le nom de l'enfant
      birthdate: parent.kids[0].birthdate, // Récupérez la date de naissance de l'enfant
      allergies, // Mets à jour les allergies
      habits, // Mets à jour les habitudes
      additionalInfo, // Mets à jour les informations supplémentaires
    };

    // Appel API pour envoyer les données au backend
    fetch(`${BACKEND_ADDRESS}/kids/update/${kidId}`, {
      // Appel de l'API pour mettre à jour les données de l'enfant
      method: "PUT", // Méthode HTTP PUT
      headers: {
        "Content-Type": "application/json", // En-tête de type de contenu
        Authorization: `Bearer ${token}`, // En-tête d'autorisation avec le token
      },
      body: JSON.stringify(payload), // Envoi des données
    })
      .then((response) => response.json())
      .then((data) => {
        // Réponse de l'API
        console.log("Réponse API:", data); // Pour le débogage
        if (data.result) {
          // Si la mise à jour est réussie
          const updatedKid = data.kid; // Supposons que l'API retourne l'enfant mis à jour

          // Dispatcher une action pour mettre à jour les données de l'enfant dans Redux
          dispatch(updateKidInfo(updatedKid)); // Met à jour l'enfant dans l'état

          setAllergies(updatedKid.allergies || ""); // Met à jour les allergies
          setHabits(updatedKid.habits || ""); // Met à jour les habitudes
          setAdditionalInfo(updatedKid.additionalInfo || ""); // Met à jour les informations supplémentaires
          console.log("Mise à jour réussie:", data.kid); // Pour le débogage
          setSuccessMessage(
            "Les informations ont été mises à jour avec succès."
          ); // Mettre à jour le message de succès
        } else {
          setSuccessMessage(""); // Réinitialiser le message de succès
          console.log(data.error || "Erreur lors de la mise à jour"); // Pour le débogage
        }
      });
  };

  //-------------------------------------------------JSX------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.backButton}>
          <Text style={globalStyles.backText}>←</Text> 
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Profil de {parent.kids[0].firstname}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
            {/* Bouton de retour */}
            {/* <TouchableOpacity
              
              onPress={() => navigation.navigate("Profil")}
            >
              <FontAwesome name="arrow-left" size={20} color="#4A7B59" solid />
            </TouchableOpacity>

            <Text style={globalStyles.title}>Profil enfant</Text> */}
            {/* Titre de la page */}
            {/* Champ de saisie pour le prénom de l'enfant */}
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                  Prénom
            </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Prénom de l'enfant"
                value={parent.kids[0].firstname || ""}
                editable={false} // Désactiver l'édition
                placeholderTextColor="#5e5e5e8a"
              />
            </View>
            {/* Champ de saisie pour le nom de l'enfant */}
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                  Nom
            </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Nom de l'enfant"
                value={parent.kids[0].lastname || ""}
                editable={false} // Désactiver l'édition
                placeholderTextColor="#5e5e5e8a"
              />
            </View>
            {/* Champ de saisie pour la date de naissance */}
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                  Date de naissance
            </Text>
              <TextInput
                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                placeholder="Date de naissance"
                value={formatDate(parent.kids[0].birthdate) || ""}
                editable={false} // Désactiver l'édition
                placeholderTextColor="#5e5e5e8a"
              />
            </View>
            {/* Champ de saisie pour les allergies */}
            <View style={buttonStyles.inputContainer}>
            <Text style={buttonStyles.label}>
                  Entrer ses allergies
            </Text>
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
            <Text style={buttonStyles.label}>
                  Entrer ses habitudes de vie
            </Text>
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
            <Text style={buttonStyles.label}>
                  Entrer toutes autres informations
            </Text>
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
            {/* Message de succès */}
            {successMessage ? (
              <Text style={globalStyles.successMessage}>{successMessage}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#67AFAC',
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     elevation: 4, // Ombre pour l'en-tête
//     // borderBottomLeftRadius: 20, // Arrondi en bas à gauche
//     // borderBottomRightRadius: 20, // Arrondi en bas à droite
//   },
//   backButton: {
//     marginRight: 0,
//   },
//   backText: {
//     color: '#fff',
//     fontSize: 28,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold',
//     flex: 0.9, // Permet d'utiliser l'espace disponible pour centrer le texte
//     textAlign: 'center', // Centre le texte dans l'espace disponible
//   },
//   button: {
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//     marginHorizontal: 5,
//     flexDirection: 'row',

//   },
//   textButton: {
//     color: "#121212",
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: 'center',
//     padding: 3
//   },
//   buttonContainerlogout: {
//     marginTop: 20,
//     flexDirection: 'row',
//   },
//   Text: {
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: 'center',
//     padding: 3
//   }
// });
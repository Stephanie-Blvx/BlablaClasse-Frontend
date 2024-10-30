import {
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

// Composant principal pour l'écran d'identification
export default function IdentificationScreen({ navigation }) {
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
            <Text style={globalStyles.title}>Identifiez-vous</Text>
            {}
            <View style={buttonStyles.buttonContainer}>
              {/*Navigation vers la page de connexion parent*/}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => navigation.navigate("LoginParent")} //naviguer vers page ProfileParent
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>Je suis Parent</Text>
                </TouchableOpacity>
              </View>
              {/* Navigation vers la page de connexion enseignant */}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => navigation.navigate("LoginTeacher")} //naviguer vers page ProfileKid
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>
                    Je suis enseignant
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

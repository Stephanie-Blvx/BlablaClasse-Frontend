import {
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //-------> url Backend
//const BACKEND_ADDRESS = "http://localhost:3000"; //-------> url Backend

// Composant principal pour l'écran d'identification
export default function IdentificationScreen({ navigation }) {

  //-------------------------------------------------JSX------------------------------------------
  return (
    // contenu de la page = mainContainer
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitleNoReturn}>Identifiez-vous</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <View style={globalStyles.container}>
            {/*Logo*/}
            <Image
              style={globalStyles.image}
              source={require('../assets/logo.png')}
            />
             {/*Navigation vers la page de QR Code reader*/}
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.transparentButton}
                onPress={() => navigation.navigate('QRreader')} 
              >
                <Text style={buttonStyles.input}>Je scanne un QR Code</Text>
              </TouchableOpacity>
            </View>
            <View style={globalStyles.dividerContainer}>
              <View style={globalStyles.line} />
              <Text style={globalStyles.orText}>OU</Text>
              <View style={globalStyles.line} />
            </View>

            <View style={buttonStyles.buttonContainer}>
              {/*Navigation vers la page de connexion parent*/}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() =>  navigation.navigate('LoginParent')} 
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>Je suis parent</Text>
                </TouchableOpacity>
              </View>
              {/* Navigation vers la page de connexion enseignant */}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() =>  navigation.navigate('LoginTeacher')} 
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}> Je suis enseignant</Text>                
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

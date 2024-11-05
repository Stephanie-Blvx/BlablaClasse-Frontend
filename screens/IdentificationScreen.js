import {
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Button
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { setUserType as setParentUserType } from '../reducers/parent';
import { setUserType as setTeacherUserType } from '../reducers/teacher';
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

const BACKEND_ADDRESS = "http://192.168.5.28:3000"; //-------> url Backend
//const BACKEND_ADDRESS = "http://localhost:3000"; //-------> url Backend

// Composant principal pour l'écran d'identification
export default function IdentificationScreen({ navigation }) {


  const dispatch = useDispatch();

  const handleUserTypeSelect = (type) => {
    console.log(`selected user type: ${type}`);
    
    if (type === 'parent') { // si parent   
      dispatch(setParentUserType(type));  // appel de la fonction setUserType du reducer parent
    } else if (type === 'teacher') { // si enseignant
      dispatch(setTeacherUserType(type)); // appel de la fonction setUserType du reducer teacher
    }
  
    // setTimeout pour naviguer vers la page de connexion
    setTimeout(() => { 
      if (type === 'parent') { // si parent naviguer vers page LoginParent
        navigation.navigate('LoginParent');
      } else if (type === 'teacher') { // si enseignant naviguer vers page LoginTeacher
        navigation.navigate('LoginTeacher');
      }
    }, 0);
  };


  //-------------------------------------------------JSX------------------------------------------
  return (
    // contenu de la page = mainContainer
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
            <Text style={globalStyles.title}>Identifiez-vous</Text>
            {/* <View style={globalStyles.lineTitle} /> */}
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

            <View style={buttonStyles.buttonContainer}>
              {/*Navigation vers la page de connexion parent*/}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => handleUserTypeSelect('parent')} 
                  activeOpacity={0.8}
                >
                  <Text style={buttonStyles.buttonText}>Je suis parent</Text>
                </TouchableOpacity>
              </View>
              {/* Navigation vers la page de connexion enseignant */}
              <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => handleUserTypeSelect('teacher')} 
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

import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  safeArea: { // Zone de sécurité pour les appareils avec encoche
    flex: 1,
    backgroundColor: '#fff', 
},
  mainContainer: { // Conteneur principal
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center',
}, 
container: { // Conteneur principal
  alignItems: 'center',
  width: '100%',
},
scrollContainer: { // Conteneur pour le défilement
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16,
},
container: {
    width: '100%', // Assurez-vous que le contenu utilise toute la largeur
},
title: { // Style du titre
  fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 40,
    marginBottom: 20, 
    textAlign: 'center', 
},
dividerContainer: { // Conteneur pour la ligne de division
  flexDirection: 'row', 
  alignItems: 'center', 
  marginVertical: 20,
},
line: { // Style de la ligne de division
  flex: 1,
  height: 1,
  backgroundColor: '#000',
  marginHorizontal: 10, 
},
lineTitle: { // Style de la ligne de division
  width: '80%',
  textAlign: 'center',
  height: 1,
  backgroundColor: '#C6D3B7',
  marginTop: -20,
  marginLeft: 'auto',
  marginRight: 'auto',
},
orText: { // Style du texte "OU"
  fontFamily: 'OpenSans_400Regular',
  textAlign: 'center',
  marginVertical: 10,
  fontSize: 16,
  color: '#000',
},
QRtext: {
  padding: 10,
},
QRbuttonContainer:  {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "75%",
},
QRContainer: {
  display: "flex",
  alignItems: "center",
},
modalContainer: { // Conteneur de la modale
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Couleur de fond semi-transparente pour assombrir l'arrière-plan
},
modalContent: { // Contenu de la modale
  width: "80%", 
  padding: 20,
  backgroundColor: "#fff", 
  borderRadius: 10,
  alignItems: "center",
  elevation: 5, // Pour une ombre légère sur Android
  shadowColor: "#000", // Ombre sur iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},
modalTitle: { // Titre de la modale
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
successMessage: { // Message de succès
  fontFamily: 'OpenSans_300Light',
  fontSize: 11,
  color: "green", 
  marginBottom: 15, 
  textAlign: "center", 
}

});

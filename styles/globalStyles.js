import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Ou une autre couleur que vous souhaitez
},
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff', // ou la couleur que vous souhaitez
    justifyContent: 'center', // Centre le contenu verticalement
},
container: {
  alignItems: 'center',
  width: '100%',
},
scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Centre le contenu verticalement
    alignItems: 'center', // Centre le contenu horizontalement
    padding: 16, // Optionnel : pour un espacement autour du contenu
},
container: {
    width: '100%', // Assurez-vous que le contenu utilise toute la largeur
},
title: {
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 20, // Espacement sous le titre
    textAlign: 'center', // Centre le texte du titre
},
dividerContainer: {
  flexDirection: 'row', 
  alignItems: 'center', 
  marginVertical: 20,
},
line: {
  flex: 1,
  height: 1,
  backgroundColor: '#000',
  marginHorizontal: 10, 
},
orText: {
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
modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Couleur de fond semi-transparente pour assombrir l'arrière-plan
},
modalContent: {
  width: "80%", // Largeur de la modale
  padding: 20,
  backgroundColor: "#fff", // Couleur de fond de la modale
  borderRadius: 10,
  alignItems: "center",
  elevation: 5, // Pour une ombre légère sur Android
  shadowColor: "#000", // Ombre sur iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

});

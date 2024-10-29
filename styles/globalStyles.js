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
});

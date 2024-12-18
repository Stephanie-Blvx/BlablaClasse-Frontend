import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  safeArea: {
    // Zone de sécurité pour les appareils avec encoche
    flex: 1,
    backgroundColor: "#f7fcfe",
  },
  mainContainer: {
    // Conteneur principal
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  container: {
    // Conteneur principal
    alignItems: "center",
    width: "100%",
  },
  containerFull: {
    width: "100%",
  },
  scrollContainer: {
    // Conteneur pour le défilement
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    backgroundColor: "#67AFAC",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 4, // Ombre pour l'en-tête
  },
  headerTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    flex: 0.9, // Permet d'utiliser l'espace disponible pour centrer le texte
    textAlign: "center", // Centre le texte dans l'espace disponible
  },
  headerTitleNoReturn: {
    fontFamily: "Montserrat_800ExtraBold",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    flex: 1, // Permet d'utiliser l'espace disponible pour centrer le texte
    textAlign: "center", // Centre le texte dans l'espace disponible
  },
  backText: {
    color: "#fff",
    fontSize: 28,
  },
  title: {
    // Style du titre
    fontFamily: "Montserrat_800ExtraBold",
    color: "#121212",
    fontSize: 38,
    marginBottom: 20,
    textAlign: "center",
  },
  dividerContainer: {
    // Conteneur pour la ligne de division
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    // Style de la ligne de division
    flex: 1,
    height: 1,
    backgroundColor: "#121212",
    marginHorizontal: 10,
  },
  lineTitle: {
    // Style de la ligne de division
    width: "80%",
    textAlign: "center",
    height: 1,
    backgroundColor: "#C6D3B7",
    marginTop: -20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  orText: {
    // Style du texte "OU"
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "#121212",
  },

  modalContainer: {
    // Conteneur de la modale
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Couleur de fond semi-transparente pour assombrir l'arrière-plan
  },
  modalContent: {
    // Contenu de la modale
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
  modalTitle: {
    // Titre de la modale
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: 'black',
},
  errorMessage: {
    // Message d'erreur
    fontFamily: "OpenSans_300Light",
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  successMessage: {
    // Message de succès
    fontFamily: "OpenSans_300Light",
    fontSize: 11,
    color: "green",
    marginBottom: 15,
    textAlign: "center",
  },

  QRtext: {
    padding: 10,
  },
  QRbuttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
  },
  QRContainer: {
    display: "flex",
    alignItems: "center",
  },
   image: {
    width: 300, 
    height: 300, //format carré
    resizeMode: 'contain',  
  },
});

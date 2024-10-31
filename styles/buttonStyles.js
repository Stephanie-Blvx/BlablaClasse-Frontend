import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  title: { // Titre de la page
    fontSize: 28,
    fontFamily: 'Montserrat_800ExtraBold',
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: { // Conteneur des champs de saisie
    width: "100%",
    marginBottom: 15,
  },
  input: { // Champ de saisie
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  inputDisabled: { // Champ de saisie désactivé
    backgroundColor: "#F0F0F0",
  },
  buttonContainer: { // Conteneur des boutons
    marginTop: 20,
    width: "100%",
  },
  QRbuttonContainer: {
    display: "flex",
		flexDirection: "column",
		justifyContent: "right",
		width: "75%",
	},
  QRbutton: {
		
		padding: 20,
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		
		margin: 10,
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    
	},
  buttonContainerlogout: { // Conteneur du bouton de déconnexion
    marginTop: 20,
  },
  button: { // Bouton
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  pressedButton: { // Bouton pressé
    opacity: 0.8
  },
  buttonText: { // Texte du bouton
    fontFamily: 'Montserrat_800ExtraBold',
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextLogout: { // Texte du bouton de déconnexion
    fontFamily: 'OpenSans_700Bold',
    color: "#FFFFFF",
    fontSize: 18,
  },
  forgotPassword: { // Lien pour mot de passe oublié
    fontFamily: 'OpenSans_300Light',
    fontSize: 11,
    textAlign: 'right',
    marginBottom: 30,
    color: '#666',
  },
  error: { // Message d'erreur
    fontFamily: 'OpenSans_300Light',
    color: "red",
  },
  cancelButtonText: { // Texte du bouton d'annulation
    fontFamily: 'OpenSans_300Light',
    color: "#69AFAC",
    fontSize: 11,
    fontWeight: "600",
    textAlign: 'center',
    marginTop: 10,
  },
  QRbuttonContainer: {
    display: "flex",
		flexDirection: "column",
		justifyContent: "right",
		width: "75%",
	},
  QRbutton: {
		
		padding: 20,
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		
		margin: 10,
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    
	},
});

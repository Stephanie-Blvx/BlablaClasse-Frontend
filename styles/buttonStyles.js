import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  title: {
    // Titre de la page
    fontSize: 28,
    fontFamily: "Montserrat_800ExtraBold",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: {
    // Conteneur des champs de saisie
    width: "100%",
    marginBottom: 15,
    // marginTop: 20,
  },
  input: {
    // Champ de saisie
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  inputDisabled: {
    // Champ de saisie désactivé
    backgroundColor: "#F0F0F0",
  },
  buttonContainer: {
    // Conteneur des boutons
    marginTop: 16,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
  },

  buttonContainerlogout: {
    // Conteneur du bouton de déconnexion
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    // Bouton
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    color: "#FFFFFF",
    width: "100%",
  }, 
  pressedButton: {
    // Bouton pressé
    opacity: 0.8,
  },
  buttonText: {
    // Texte du bouton
    fontFamily: "Montserrat_800ExtraBold",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextLogout: {
    // Texte du bouton de déconnexion
    fontFamily: "OpenSans_700Bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
  forgotPassword: {
    // Lien pour mot de passe oublié
    fontFamily: "OpenSans_300Light",
    fontSize: 11,
    textAlign: "right",
    marginBottom: 30,
    color: "#666",
  },
  cancelButtonText: {
    // Texte du bouton d'annulation
    fontFamily: "OpenSans_300Light",
    color: "#69AFAC",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  label: {
    display: "flex",
    fontSize: 14,
    fontWeight: "light",
    alignItems: "flex-start",
    marginBottom: 5,
    color: "#121212",
  },

  buttonDownload: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 5,
     marginTop: 40,
    // marginLeft: 30,
  },
  buttonDownloadPress : {
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonDownloadText: {
    color: "#69AFAC",
    fontSize: 14,
    fontWeight: "600",
  },

// QR CODE
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
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 30,
  },

  logoutContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fcfe',
    paddingVertical: 15,
    borderRadius: 8,
    width: 200,
  },
  logouttext: {
      fontFamily: "OpenSans_700Bold",
      color: "#121212",
      fontSize: 18,
      marginLeft: 10,
  }
});

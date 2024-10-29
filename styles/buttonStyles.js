import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputDisabled: {
    backgroundColor: "#F0F0F0",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  pressedButton: {
    opacity: 0.8
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

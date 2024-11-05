import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  lastActuContainer: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#69AFAC",
    borderRadius: 10,
    padding: 10,
    marginTop: 40,
    alignItems: "center",
    width: "100%"
  },
  lastActuTitle: {
    textDecorationLine: "underline",
    color: "#69AFAC",
    fontSize: 14, 
    fontWeight: "600",
    marginBottom: 10,
  },
  lastActuContent: {
    color: "#69AFAC",
    fontSize: 12,
    fontWeight: "600",
  },

  // Agenda

  containerAgenda: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

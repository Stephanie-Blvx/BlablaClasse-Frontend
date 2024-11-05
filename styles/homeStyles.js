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

  // Agenda teacher
  addButton: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    padding: 3,
  },
  closedButton: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    padding: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 200,
    borderBottomColor: "#69AFAC",
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    width: "20%",
    backgroundColor: "#69AFAC",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  inputActu: {
    width: 200,
    borderBottomColor: "#69AFAC",
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 8,
    padding: 40,
  },
  teacherButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 5,
  },
  validationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 5,
  },
  titleLength: {
    color: "#121212",
    fontSize: 12,
    marginVertical: 5,
  },
  deleteIcon: {
    marginBottom: 10,
    marginTop: 10,
    color: "#8DBFA9",
  
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

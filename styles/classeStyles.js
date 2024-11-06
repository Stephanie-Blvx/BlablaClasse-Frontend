import { StyleSheet } from "react-native";

export const classeStyles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
  },
  messageContainer: {
    // padding: 10,
    // //marginHorizontal: 10,
    // marginVertical: 5,
    // shadowColor: "#000",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 10,
    padding: 10,
    //marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // pour Android
    backgroundColor: "white",
    borderRadius: 8
   
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
    marginRight: 10,
  },
  messageInfos: {
    fontSize: 14,
    color: '#121212',
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  messageContentContainerParent: {
    flex: 1,
    padding: 10,
  },
  messageContentContainerTeacher: {
    padding: 10,
    flex: 1,
  },
  titleClass: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#69AFAC",
    textAlign: "center",
  },
  title2: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#69AFAC",
  },
  messageContent: {
    fontSize: 14,
    marginVertical: 5,
    color: '#121212',
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 20,
    marginTop: 5,
  },
  checkbox: {
    alignSelf: "center",
    marginLeft: 5,
  },
  deleteIcon: {
    paddingLeft: 10,
    marginRight: 10,
    color: "#8DBFA9",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    color: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#121212",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#67AFAC",
    color: "white",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "#121212",
  },
  titleClass: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#67AFAC",
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 10,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
    alignItems: "center",
  },
  trashCan: {
    marginTop: -2,
  },
  attachmentIcon: {
    padding: 10,
  },
  buttonText: {
    color: "#67AFAC",
  },
  confirmedButton: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    padding: 3,
  },
  button: {
    width: "40%",
    backgroundColor: "#69AFAC",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  validationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 5,
  },
  postButton: {
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    color: "#FFFFFF",
    width: "80%",
  },
  editIcon: {
    marginRight: 10,
  }
});

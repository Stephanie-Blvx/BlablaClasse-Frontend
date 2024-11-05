import { StyleSheet } from "react-native";

// Styles inchangés
export const chatStyles = StyleSheet.create({
  // chatContainer: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   backgroundColor: "#000",
  // },
  banner: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inset: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    paddingTop: 10,
    position: "relative",
    borderTopWidth: 1,
  },
  greetingText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 8,
  },
  message: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 8,
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: "65%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  messageWrapper: {
    alignItems: "flex-end",
   // marginBottom: 20,
  },
  messageRecieved: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageSent: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageSentBg: {
    backgroundColor: "#C6D3B7",
  },
  messageRecievedBg: {
    backgroundColor: "#8DBFA9",
  },
  messageText: {
    color: "#000000",
    fontWeight: "400",
  },
  timeText: {
    color: "#506568",
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
  usernameText: {
    color: "#506568",
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    justifySelf: "flex-end",
    alignContent: "flex-start",
    marginBottom: 0,
    marginTop: "auto",
    background: "transparent",
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    width: "80%",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  sendButton: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: "#F9F2D9",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  scroller: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    flexGrow: 1,
    
  },
});

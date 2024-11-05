import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";
import { chatStyles } from "../styles/chatStyles";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Pusher from "pusher-js/react-native";
import { useSelector } from "react-redux";

const pusher = new Pusher("62bd3eeee3b805e7b467", { cluster: "eu" });
//const BACKEND_ADDRESS = "http://192.168.1.30:3000";
const BACKEND_ADDRESS = "http://192.168.3.174:3000"

export default function ChatScreen() {
  const [messages, setMessages] = useState([]); // Tableau des messages
  const [messageText, setMessageText] = useState(""); // Texte du message
  const scrollViewRef = useRef(); // Référence à la ScrollView pour le scroll automatique et que le clavier ne cache pas les messages

  const username = useSelector(
    (state) => state.parent.value.username || state.teacher.value.username
  ); // Nom d'utilisateur
  const userType = useSelector(
    (state) => state.parent.value.userType || state.teacher.value.userType
  ); // Type d'utilisateur

  console.log("username:", username);
  console.log("userType:", userType);

  if (!username) {
    console.error("Erreur : username non défini"); // Afficher une erreur si le nom d'utilisateur n'est pas défini
    return (
      <View>
        <Text>Erreur : username non défini</Text>
      </View>
    );
  }

  useEffect(() => {
    if (username) {
      // Si le nom d'utilisateur est défini
      const fetchMessages = async () => {
        // Fonction pour récupérer les messages
        try {
          // Récupérer les messages depuis AsyncStorage
          const storedMessages = await AsyncStorage.getItem("chatMessages");
          const parsedStoredMessages = storedMessages // Analyser les messages stockés
            ? JSON.parse(storedMessages) // Si des messages sont stockés, les analyser
            : [];

          // Récupérer les messages depuis la base de données
          const response = await fetch(`${BACKEND_ADDRESS}/messages`);

          // Vérifier si la réponse est correcte
          if (!response.ok) {
            const errorMessage = await response.text(); // Lire la réponse en texte pour déboguer
            console.error(
              "Erreur lors de la récupération des messages :",
              response.status, // Afficher le statut de la réponse
              errorMessage // Afficher le message d'erreur
            );
            return; // Quitter la fonction si la réponse n'est pas OK
          }

          const dbMessages = await response.json(); // Récupérer les messages de la base de données

          // Mettre à jour AsyncStorage avec les messages de la base de données
          const dbMessageIds = dbMessages.map((message) => message.id);
          const updatedMessages = parsedStoredMessages.filter(
            (message) => dbMessageIds.includes(message.id) // Garder les messages qui sont dans la base de données
          );

          // Si des messages sont manquants, les supprimer d'AsyncStorage
          if (updatedMessages.length !== parsedStoredMessages.length) {
            await AsyncStorage.setItem(
              "chatMessages",
              JSON.stringify(updatedMessages) // Stocker les messages mis à jour
            );
          }

          setMessages(updatedMessages); // Mettre à jour les messages avec les messages mis à jour
        } catch (error) {
          console.error("Erreur lors de la récupération des messages :", error);
        }
      };

      fetchMessages(); // Appel de la fonction pour récupérer les messages

      console.log("Params reçus dans ChatScreen : ", { username, userType });
      fetch(`${BACKEND_ADDRESS}/users/${username}`, {
        // Enregistrement de l'utilisateur sur le serveur
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType }),
      });

      const subscription = pusher.subscribe("chat"); // Souscription à la chaîne de chat
      subscription.bind("pusher:subscription_succeeded", () => {
        // Lorsque la souscription est réussie
        subscription.bind("message", handleReceiveMessage); // Lorsqu'un message est reçu
      });

      return () =>
        fetch(`${BACKEND_ADDRESS}/users/${username}`, {
          // Suppression de l'utilisateur du serveur lorsqu'il quitte la page
          method: "DELETE", // Suppression de l'utilisateur du serveur
          headers: { "Content-Type": "application/json" }, // Type de contenu
          body: JSON.stringify({ userType }), // Type d'utilisateur
        });
    }
  }, [username, userType]); // Déclenchement de l'effet lorsque le nom d'utilisateur ou le type d'utilisateur change

  const handleReceiveMessage = (data) => {
    // Lorsqu'un message est reçu
    setMessages((messages) => {
      const updatedMessages = [...messages, data];
      storeMessages(updatedMessages); // Stocker les messages
      return updatedMessages; // Retourner les messages mis à jour
    });
    scrollToBottom(); // Faire défiler vers le bas
  };

  const handleSendMessage = () => {
    // Lorsqu'un message est envoyé
    if (!messageText) return; // Si le message est vide, ne rien faire

    const payload = {
      // Préparation du message
      text: messageText, // Texte du message
      username, // Nom d'utilisateur
      userType, // Type d'utilisateur
      createdAt: new Date(), // Date de création
    };

    fetch(`http://192.168.3.174:3000/message`, {
      // Envoi du message au serveur
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessageText(""); // Réinitialisation du champ de texte
    scrollToBottom(); // Faire défiler vers le bas
  };

  const scrollToBottom = () => {
    // Faire défiler vers le bas
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Faire défiler jusqu'à la fin de la liste
  };

  const storeMessages = async (messages) => {
    // Stocker les messages
    try {
      // Stocker les messages
      await AsyncStorage.setItem("chatMessages", JSON.stringify(messages)); // Stocker les messages dans le stockage local
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des messages :", error);
    }
  };

  const formatDate = (dateString) => {
    // Formater la date
    const date = new Date(dateString); // Créer une date à partir de la chaîne de date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }; // Options de formatage
    return date.toLocaleDateString("fr-FR", options); // Retourner la date formatée en français
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea]}>
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.backButton}
        >
          <Text style={globalStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={chatStyles.greetingText}>Bonjour {username}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
      >
        {/* Affichage des messages */}
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={chatStyles.scroller}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: messages.length === 0 ? "center" : "flex-start",
            }}
          >
            {messages.length === 0 ? (
              // Affichage lorsque la liste de messages est vide
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={chatStyles.emptyText}>
                  Pas de messages pour le moment
                </Text>
              </View>
            ) : (
              // Affichage des messages
              messages.map((message, i) => (
                <View
                  key={i}
                  style={[
                    chatStyles.messageWrapper,
                    message.username === username
                      ? chatStyles.messageSent
                      : chatStyles.messageRecieved,
                  ]}
                >
                  <Text style={chatStyles.usernameText}>
                    {message.username}
                  </Text>
                  <View
                    style={[
                      chatStyles.message,
                      message.username === username
                        ? chatStyles.messageSentBg
                        : chatStyles.messageRecievedBg,
                    ]}
                  >
                    <Text style={chatStyles.messageText}>{message.text}</Text>
                  </View>
                  <Text style={chatStyles.timeText}>
                    {formatDate(message.createdAt)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Champ de saisie, toujours en bas */}
        <View style={chatStyles.inputContainer}>
          <TextInput
            onChangeText={(value) => setMessageText(value)}
            value={messageText}
            style={chatStyles.input}
            autoFocus
          />
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            style={chatStyles.sendButton}
          >
            <MaterialIcons name="send" color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

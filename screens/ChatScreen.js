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
  Alert,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { chatStyles } from "../styles/chatStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Pusher from "pusher-js/react-native";
import { useSelector } from "react-redux";

const pusher = new Pusher("62bd3eeee3b805e7b467", { cluster: "eu" });
const BACKEND_ADDRESS = "https://blabla-classe-backend.vercel.app";

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]); // Tableau des messages
  const [messageText, setMessageText] = useState(""); // Texte du message
  const scrollViewRef = useRef(); // Référence à la ScrollView pour le scroll automatique et que le clavier ne cache pas les messages

  const parent = useSelector((state) => state.parent.value);
  const teacher = useSelector((state) => state.teacher.value);
  const username = parent?.username || teacher?.username; // Nom d'utilisateur
  const userType = parent?.userType || teacher?.userType; // Type d'utilisateur

  console.log("parent:", parent);
  console.log("teacher:", teacher);
  console.log("username:", username);
  console.log("userType:", userType);
  const scrollToBottom = () => { // Fonction pour défiler jusqu'en bas
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Défiler jusqu'en bas
  };
  
  useEffect(() => {
    if (username) { // Si le nom d'utilisateur est défini
      const fetchMessages = async () => {
        try { // Récupération des messages
          const response = await fetch(`${BACKEND_ADDRESS}/messages`); // Requête GET vers la route /messages

          if (!response.ok) { // Si la réponse n'est pas ok
            const errorMessage = await response.text(); // Message d'erreur
            throw new Error(`Erreur HTTP : ${response.status} - ${errorMessage}`); // Lancer une erreur
          }

          const dbMessages = await response.json(); // Récupérer les messages de la base de données
          setMessages(dbMessages); // Mettre à jour les messages
          scrollToBottom(); // Défiler jusqu'en bas
        } catch (error) {
          console.error("Erreur lors de la récupération des messages :", error); // Log de l'erreur
          Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des messages."); // Alerte d'erreur
        }
      };

      fetchMessages();// Appel de la fonction fetchMessages

      console.log("Params reçus dans ChatScreen : ", { username, userType }); // Log des paramètres reçus
      fetch(`${BACKEND_ADDRESS}/users/${username}`, { // Requête PUT vers la route /users/username
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType }),
      });

      const subscription = pusher.subscribe("chat"); // Souscription au canal "chat"
      subscription.bind("pusher:subscription_succeeded", () => { // Lorsque la souscription est réussie
        subscription.bind("message", handleReceiveMessage); // Lorsqu'un message est reçu
      });

      return () =>
        fetch(`${BACKEND_ADDRESS}/users/${username}`, { // Requête DELETE vers la route /users/username
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType }),
        });
    }
  }, [username, userType]); // Déclenché à chaque changement de username ou userType

  useEffect(() => { // Effet déclenché à chaque changement de messages
    scrollToBottom(); // Défile automatiquement chaque fois que `messages` change
  }, [messages]); // Déclenché à chaque changement de messages

  const handleReceiveMessage = (data) => { // Fonction pour recevoir un message
    setMessages((prevMessages) => [...prevMessages, data]); // Ajouter le message reçu à la liste des messages
    scrollToBottom(); // Défiler jusqu'en bas
  };

  const handleSendMessage = () => { // Fonction pour envoyer un message
    if (!messageText) return;

    const payload = {
      text: messageText,
      username,
      userType,
      createdAt: new Date(),
    };

    fetch(`${BACKEND_ADDRESS}/messages/`, { // Requête POST vers la route /messages
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessageText(""); // Réinitialiser le champ de texte
    scrollToBottom(); // Défiler jusqu'en bas
  };

  

  const formatDate = (dateString) => { // Fonction pour formater la date
    const date = new Date(dateString); // Créer une nouvelle date
    return date.toLocaleDateString("fr-FR", {
      weekday: "long", // Jour de la semaine
      year: "numeric",   // Année
      month: "short",   // Mois
      day: "numeric",  // Jour
      hour: "2-digit", // Heures
      minute: "2-digit", // Minutes
    });
  };

  if (!username) { 
    return ( // Si le nom d'utilisateur n'est pas défini
      <View style={globalStyles.centeredContainer}> 
        <Text>Chargement des données...</Text> 
      </View>
    );
  }

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
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={chatStyles.emptyText}>Pas de messages pour le moment</Text>
              </View>
            ) : (
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
                  <Text style={chatStyles.usernameText}>{message.username}</Text>
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
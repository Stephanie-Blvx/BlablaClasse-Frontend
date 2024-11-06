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
const BACKEND_ADDRESS = 'http://localhost:3000'

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef();

  const username = useSelector(
    (state) => state.parent.value.username || state.teacher.value.username
  );
  const userType = useSelector(
    (state) => state.parent.value.userType || state.teacher.value.userType
  );

  useEffect(() => {
    if (!username) return;

    // Charger les messages
    const fetchMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem("chatMessages");
        const parsedStoredMessages = storedMessages
          ? JSON.parse(storedMessages)
          : [];

        const response = await fetch(`${BACKEND_ADDRESS}/messages`);
        if (!response.ok) {
          console.error(
            "Erreur lors de la récupération des messages :",
            response.status
          );
          return;
        }

        const dbMessages = await response.json();
        const allMessages = [...parsedStoredMessages, ...dbMessages];
        setMessages(allMessages);
        scrollToBottom(); // Défile automatiquement après le chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    };

    fetchMessages();

    // Souscrire à Pusher
    const subscription = pusher.subscribe("chat");
    subscription.bind("message", handleReceiveMessage);

    return () => {
      subscription.unbind("message", handleReceiveMessage);
      pusher.unsubscribe("chat");
    };
  }, [username]);

  useEffect(() => {
    scrollToBottom(); // Défile automatiquement chaque fois que `messages` change
  }, [messages]);

  const handleReceiveMessage = (data) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, data];
      storeMessages(updatedMessages);
      return updatedMessages;
    });
  };

  const handleSendMessage = () => {
    if (!messageText) return;

    const payload = {
      text: messageText,
      username,
      userType,
      createdAt: new Date(),
    };

    fetch(`${BACKEND_ADDRESS}/messages/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessageText("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const storeMessages = async (messages) => {
    try {
      await AsyncStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des messages :", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!username) {
    return (
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

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, TextInput, SafeAreaView, Platform, TouchableOpacity, ScrollView, Button, StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from "../styles/globalStyles";

const initialMessages = [
  { author: 'parent1', timestamp: new Date(), seen: true, content: "bonjour, mon fils est malade aujourd'hui" },
  { author: 'teacher1', timestamp: new Date(), seen: true, content: "c'est noté, bon rétablissement à lui, tenez-moi informé svp" },
  { author: 'parent1', timestamp: new Date(), seen: true, content: "bien sûr, bonne journée à vous. Mr Drucker" },
]

export default function TchatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        author: 'parent1', // par défaut
        timestamp: new Date(),
        seen: false, // par défaut
        content: newMessage,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={{ alignItems: item.author === 'parent1' ? 'flex-end' : 'flex-start' }}>
      <Text style={[styles.timestamp, { marginTop: 5 }]}> {item.timestamp.toLocaleString()} </Text>
      <View style={[styles.messageContainer, item.author === 'parent1' ? styles.parentMessage : styles.teacherMessage]}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.content}>{item.content}</Text>
        {item.seen && <FontAwesome name="check" size={14} color="#4a7b59" style={styles.seenIcon} />}
      </View>
    </View>
  );
  const renderInput = () => (
  <View style={[styles.messageContainer, styles.parentMessage, ]}>
  <TextInput
    value={newMessage}
    multiline={true}
    onChangeText={setNewMessage}
    placeholder="Écrire un message..."
    onSubmitEditing={sendMessage} // Optionnel pour envoyer avec la touche "Entrée"
  />
  <FontAwesome name="send" onPress={sendMessage} size={14} color="#4a7b59" style={styles.seenIcon} />
</View>);

  return (

    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#8DBFA9" />
      <KeyboardAvoidingView
        style={{ flex: 1, margin: 10 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
      >
        
          <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Messagerie</Text>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              ListFooterComponent={renderInput} // Ajoute le champ de saisie à la fin
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.scrollContainer}
            />
          </View>
        
      
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 60,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderWidth: 1,
    borderColor: "red",
  },
  parentMessage: {
    width: 400,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
    borderColor: '#c6d3b7',
    borderWidth: 1,
  },
  teacherMessage: {
    width: 400,
    backgroundColor: '#c6d3b7',
    alignSelf: 'flex-start',
  },
  author: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
  timestamp: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  seenIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});





import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { globalStyles } from "../styles/globalStyles";
import { classeStyles } from "../styles/classeStyles";
const BACK_URL =  "https://blabla-classe-backend.vercel.app";
import Checkbox from "expo-checkbox";

const MessageWithCheckbox = ({ post, postId, onToggleReadStatus }) => {
  const [isChecked, setIsChecked] = useState(post.isRead);

  const handleCheckboxChange = (newValue) => {
    setIsChecked(newValue); // Mettre à jour l’état local de la checkbox
    onToggleReadStatus(postId, newValue); // Appeler la fonction pour mettre à jour dans la DB
  };

  console.log("post.author.firstname", post.author.firstname);

   // Vérification de la présence de `post.author` pour éviter l'erreur
   const authorName = post.author ? `${post.author.firstname} @${post.author.username}` : "Auteur inconnu";

  return (
    <View
      style={[
        classeStyles.messageContainer,
        { backgroundColor: isChecked ? "#69AFAC" : "white" },
      ]}
    >
      <View style={classeStyles.headerContainer}>
        <Image
          source={require("../assets/avatar-1.jpg")}
          style={classeStyles.avatar}
        />
        <View style={classeStyles.authorInfo}>
          <Text style={classeStyles.messageInfos}>
            {authorName}
          </Text>
          <Text>{new Date(post.creationDate).toLocaleString()}</Text>
        </View>
        <TouchableOpacity>
          <Checkbox
            value={isChecked}
            onValueChange={handleCheckboxChange}
            style={classeStyles.checkbox}
          />
        </TouchableOpacity>
      </View>
      <View style={classeStyles.messageContentContainerParent}>
        <Text
          style={[
            classeStyles.title2,
            { color: isChecked ? "black" : "#69AFAC" },
          ]}
        >
          {post.title}
        </Text>
        <Text
          style={classeStyles.messageContent}
        >
          {post.content}
        </Text>
        {post.images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={classeStyles.image}
          />
        ))}
      </View>
    </View>
  );
};
export default function ParentClassScreen({navigation}) {
  const [posts, setPosts] = useState([]);
  const parent = useSelector((state) => state.parent.value);
  const childName = parent.kids && parent.kids.length > 0 ? parent.kids[0].firstname : "Enfant"; // Récupérer le prénom du premier enfant de la liste des enfants du parent connecté ou "Enfant" par défaut si pas d'enfant dans la liste 

  console.log("nom de mon enfant",childName);

  // Fetch des posts dans la db
  const fetchPosts = () => {
    fetch(`${BACK_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data.posts);
        if (data.result) {
          const sortedPosts = data.posts.sort(
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
          );
          setPosts(sortedPosts);
        } else {
          console.error(data.error);
        }
      });
  };

  // appeler fetchPosts dès le premier rendu de la page
  useEffect(() => {
    fetchPosts();
  }, []);

  // Mise à jour de isRead dans la db
  const handleToggleReadStatus = (postId, isRead) => {
    console.log(`Updating postId: ${postId} to isRead: ${isRead}`);
    fetch(`${BACK_URL}/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          console.error("Erreur de mise à jour :", result.error);
        }
      });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
       <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
       <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.backButton}>
          <Text style={globalStyles.backText}>←</Text> 
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Classe de {childName}</Text>
      </View>
       <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
      <ScrollView>
      <View style={classeStyles.container}>
          {posts.map((post) => (
            <MessageWithCheckbox
              key={post._id}
              post={post}
              postId={post._id}
              onToggleReadStatus={handleToggleReadStatus}
            />
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

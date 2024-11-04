import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { globalStyles } from "../styles/globalStyles";
import { classeStyles } from "../styles/classeStyles";
const BACK_URL = "http://192.168.1.30:3000";
const Message = ({ post, postId, onDeletePost, onUpdatePost }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  // gestion des actions utilisateur
  const handleDeletePress = () => setModalVisible(true);
  const handleConfirmDelete = () => {
    onDeletePost(postId);
    setModalVisible(false);
  };
  const handleCancelDelete = () => setModalVisible(false);

  const handleEditPress = () => setIsEditing(true);
  const handleConfirmEdit = () => {
    onUpdatePost(postId, editedTitle, editedContent);
    setIsEditing(false);
  };

  return (
    <View style={classeStyles.messageContainer}>
      <View style={classeStyles.headerContainer}>
        <Image
          source={require("../assets/avatar-1.jpg")}
          style={classeStyles.avatar}
        />
        <View style={classeStyles.authorInfo}>
          <Text style={classeStyles.messageInfos}>
            {post.author.firstname} @{post.author.username} -{" "}
            {new Date(post.creationDate).toLocaleString()}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={handleEditPress}
            style={classeStyles.editIcon}
          >
            <FontAwesome name="edit" size={24} color="#4A7B59" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeletePress}
            style={classeStyles.deleteIcon}
          >
            <FontAwesome name="trash" size={24} color="#4A7B59" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={classeStyles.messageContentContainerTeacher}>
        <Text style={classeStyles.title2}>{post.title}</Text>
        <Text style={classeStyles.messageContent}>{post.content}</Text>
        {post.images.map((imagePath, index) => (
          <Image
            key={index}
            source={{ uri: imagePath }}
            style={classeStyles.image}
          />
        ))}
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={classeStyles.modalContainer}>
          <View style={classeStyles.modalContent}>
            <Text style={classeStyles.modalTitle}>Suppression</Text>
            <Text color="white">Voulez-vous vraiment supprimer ce post ?</Text>
            <View style={classeStyles.buttonContainer}>
              <Button
                title="Oui"
                color="#67AFAC"
                onPress={handleConfirmDelete}
              />
              <Button
                title="Non"
                color="#67AFAC"
                onPress={handleCancelDelete}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={classeStyles.modalContainer}>
          <View style={classeStyles.modalContent}>
            <Text style={classeStyles.modalTitle}>Modifier le Post</Text>
            <TextInput
              placeholder="Titre"
              value={editedTitle}
              onChangeText={setEditedTitle}
              style={classeStyles.input}
            />
            <TextInput
              placeholder="Contenu"
              value={editedContent}
              onChangeText={setEditedContent}
              style={classeStyles.input}
              multiline
            />
            <Button
              title="Sauvegarder"
              color="#67AFAC"
              onPress={handleConfirmEdit}
            />
            <Button
              title="Annuler"
              color="#67AFAC"
              onPress={() => setIsEditing(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function ClassScreen() {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const teacher = useSelector((state) => state.teacher.value);

  // Récupérer les posts depuis la db
  const fetchPosts = () => {
    fetch(`${BACK_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
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
  // Faire un render au chargement du code
  useEffect(() => {
    fetchPosts();
  }, []);

  // Supprimer un post
  const handleDeletePost = (postId) => {
    fetch(`http://localhost:3000/posts/${postId}`, { method: "DELETE" });
    fetch(`${BACK_URL}/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setPosts(posts.filter((post) => post._id !== postId));
        } else {
          console.error("Erreur de suppression :", result.error);
        }
      });
  };

  // Modifier un post
  const handleUpdatePost = (postId, newTitle, newContent) => {
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setPosts(
            posts.map((post) => (post._id === postId ? result.post : post))
          );
        } else {
          console.error("Erreur de mise à jour :", result.error);
        }
      });
  };

  // Ajouter un post avec ou sans Image
  const handleAddPost = () => {
    if (newTitle.length > 40 || newContent.length > 180) {
      alert(
        "Le titre doit être limité à 40 caractères et le contenu à 180 caractères."
      );
      return;
    }
    console.log("Image sélectionnée avant ajout :", selectedImage);

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append(
      "author",
      JSON.stringify({
        id: teacher.id,
        username: teacher.username,
        firstname: teacher.firstname,
      })
    );

    // Ajout de l'image au formData si elle existe
    if (selectedImage) {
      console.log("Image sélectionnée :", selectedImage);

      // Convertir l'URI de l'image en Blob
      const base64Data = selectedImage.split(",")[1]; // Enlève le préfixe
      const imageBlob = new Blob(
        [
          new Uint8Array(
            atob(base64Data)
              .split("")
              .map((c) => c.charCodeAt(0))
          ),
        ],
        { type: "image/jpeg" }
      );

      formData.append("photoFromFront", imageBlob, "upload.jpg");
    } else {
      console.log("Aucune image sélectionnée.");
    }

    console.log("Données à envoyer :", formData);

    fetch(`${BACK_URL}/posts`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Réponse du serveur :", response);
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          const newPostWithId = {
            ...result.post,
            cloudinaryId: result.post.cloudinaryId,
          };
          setPosts([newPostWithId, ...posts]);
          setModalVisible(false);
          setNewTitle("");
          setNewContent("");
          setSelectedImage(null);
        } else {
          console.error("Erreur d'ajout :", result.error);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du post : ", error);
        alert("Erreur lors de l'ajout du post.");
      });
  };

  // Ouvrir la bibliothèque  pour ajouter une image au post
  const pickImage = async () => {
    // Demander la permission d'accéder à la bibliothèque de médias
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    // Ouvrir le sélecteur d'images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedUri = result.assets[0].uri;
      console.log("Image selected:", selectedUri);
      setSelectedImage(selectedUri);
    } else {
      console.log("Image selection canceled.");
    }
  };

  // Prendre une photo avec son appareil pour l'ajouter au post
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Photo taken:", result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("Camera action canceled.");
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Modifier la couleur de la barre d'état */}
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
     
          <View style={globalStyles.container}>
          <Text style={globalStyles.title}>Classe de Mme Untel</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.textButton}>Ajouter un Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
          {posts.map((post) => (
            <Message
              key={post._id}
              post={post}
              postId={post._id}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un post</Text>
            <TextInput
              placeholder="Titre"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <Text style={styles.charCount}>
              {40 - newTitle.length} caractères restants
            </Text>

            <TextInput
              placeholder="Contenu"
              value={newContent}
              onChangeText={setNewContent}
              style={styles.input}
              multiline
            />
            <Text style={styles.charCount}>
              {180 - newContent.length} caractères restants
            </Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.attachmentIcon}
              >
                <FontAwesome name="paperclip" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhoto}
                style={styles.attachmentIcon}
              >
                <FontAwesome name="camera" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={styles.closeButton}
                >
                  <FontAwesome name="times" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}

            <Button title="Ajouter" color="#67AFAC" onPress={handleAddPost} />
            <Button
              title="Annuler"
              color="#67AFAC"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#67AFAC",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  messageContentContainer: {
    marginTop: 10,
  },
  messageInfos: {
    color: "black",
    fontSize: 12,
  },
  title2: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#69AFAC",
  },
  messageContent: {
    fontSize: 14,
    marginVertical: 5,
    color: "#69AFAC",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 20,
    marginTop: 5,
  },
  deleteIcon: {
    paddingLeft: 10,
    marginRight: 10,
    color: "#C6D387",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#67AFAC",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    color: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
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
    color: "white",
  },
  titleClass: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#69AFAC",
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  attachmentIcon: {
    padding: 10,
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },
});

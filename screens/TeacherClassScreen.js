import {
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
import { buttonStyles } from "../styles/buttonStyles";
import { homeStyles } from "../styles/homeStyles";
const BACK_URL = "http://localhost:3000";
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
  //-------------------------------------------------JSX------------------------------------------
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
        <View style={classeStyles.iconContainer}>
          <View>
            <TouchableOpacity
              onPress={handleEditPress}
              style={classeStyles.editIcon}
            >
              <FontAwesome name="edit" size={24} color="#8DBFA9" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleDeletePress}>
              <FontAwesome name="trash" size={24} color="#8DBFA9" style={classeStyles.trashCan} />
            </TouchableOpacity>
          </View>
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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={classeStyles.modalContainer}>
          <View style={classeStyles.modalContent}>
            <View style={buttonStyles.buttonContainer}>
              <Text style={classeStyles.modalTitle}>Suppression</Text>
              <Text color="white">Voulez-vous vraiment supprimer ce post ?</Text>
              <View style={classeStyles.validationButtons}>
                <TouchableOpacity
                  style={classeStyles.button}
                  onPress={handleConfirmDelete}
                  activeOpacity={0.8}
                >
                  <Text style={classeStyles.confirmedButton}>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={classeStyles.button}
                  onPress={handleCancelDelete}
                  activeOpacity={0.8}
                >
                  <Text style={classeStyles.confirmedButton}>Non</Text>
                </TouchableOpacity>
              </View>
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
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={handleConfirmEdit}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonText}>Sauvegarder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={buttonStyles.cancelButton}
                onPress={() => setIsEditing(false)}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function TeacherClassScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const teacher = useSelector((state) => state.teacher.value);

  //----------------------  Récupérer les posts depuis la db ----------------------
  const fetchPosts = () => {
    fetch(`${BACK_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const sortedPosts = data.posts.sort( // tri des posts
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate) // tri du plus récent au plus ancien
          ); // tri du plus récent au plus ancien
          setPosts(sortedPosts); // Mettre à jour les posts
        } else {
          console.error(data.error);
        }
      });
  };
  // Faire un render au chargement du code
  useEffect(() => {
    fetchPosts(); // Récupérer les posts
  }, []); // [] pour ne pas boucler

  //----------------------  Supprimer un post ----------------------
  const handleDeletePost = (postId) => {
    fetch(`${BACK_URL}/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {  // Si la suppression est un succès
          setPosts(posts.filter((post) => post._id !== postId));  // Mettre à jour les posts
        } else {
          console.error("Erreur de suppression :", result.error);
        }
      });
  };

  //----------------------  Modifier un post ----------------------
  const handleUpdatePost = (postId, newTitle, newContent) => {
    fetch(`${BACK_URL}/posts/${postId}`, {
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

  //----------------------  Ajouter un post avec ou sans Image ----------------------
  const handleAddPost = () => {
    if (newTitle.length > 40 || newContent.length > 180) {
      alert(
        "Le titre doit être limité à 40 caractères et le contenu à 180 caractères."
      );
      return;
    }
    console.log("Image sélectionnée avant ajout :", selectedImage); // pour débogage

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
          new Uint8Array( //crée un tableau binaire pour initialiser le blob
            atob(base64Data) //décode les donnees en base 64 et transforme en chaine de caracteres binaire
              .split("") //sépare chaque caractère pour la lecture
              .map((c) => c.charCodeAt(0)) //transforme chque caractère en son code ASP2
          ),
        ],
        { type: "image/jpeg" } //permet de reconnaîre le blob comme une image jpeg
      );

      formData.append("photoFromFront", imageBlob, "upload.jpg");
    } else {
      console.log("Aucune image sélectionnée.");
    }

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

  //----------------------  Ouvrir la bibliothèque  pour ajouter une image au post ----------------------
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

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      console.log("Image selected:", selectedUri);
      setSelectedImage(selectedUri);
    } else {
      console.log("Image selection canceled.");
    }
  };

  //----------------------  Prendre une photo avec son appareil pour l'ajouter au post ----------------------
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
  //-------------------------------------------------JSX------------------------------------------
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.backButton}
        >
          <Text style={globalStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>
          Classe de {teacher.firstname}
        </Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <View style={classeStyles.container}>
          <View style={buttonStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={classeStyles.postButton}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.buttonText}>Ajouter un Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
          <View style={classeStyles.container}>
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

        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={globalStyles.modalContainer}>
            <View style={globalStyles.modalContent}>
              <Text style={globalStyles.modalTitle}>Ajouter un post</Text>
              <TextInput
                placeholder="Titre"
                value={newTitle}
                onChangeText={setNewTitle}
                style={buttonStyles.input}
              />
              <Text style={homeStyles.titleLength}>{40 - newTitle.length} caractères restants</Text>

              <TextInput
                placeholder="Contenu"
                value={newContent}
                onChangeText={setNewContent}
                style={buttonStyles.input}
                multiline
              />
              <Text style={homeStyles.titleLength}>{180 - newContent.length} caractères restants</Text>
              <View style={buttonStyles.iconsContainer}>
                <TouchableOpacity onPress={pickImage}>
                  <FontAwesome name="paperclip" size={24} color="#67AFAC" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
                  <FontAwesome name="camera" size={24} color="#67AFAC" />
                </TouchableOpacity>
              </View>

              {selectedImage && (
                <View style={classeStyles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={classeStyles.imagePreview} />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={classeStyles.closeButton}
                  >
                    <FontAwesome name="times" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={globalStyles.container}>
                <View style={buttonStyles.buttonContainer}>
                  <TouchableOpacity
                    style={buttonStyles.button}
                    onPress={handleAddPost}
                    activeOpacity={0.8}
                  >
                    <Text style={buttonStyles.buttonText}>Ajouter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={buttonStyles.cancelButton}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={buttonStyles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

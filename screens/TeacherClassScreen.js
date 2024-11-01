import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { globalStyles } from '../styles/globalStyles';

const Message = ({ post, postId, onDeletePost, onUpdatePost }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedContent, setEditedContent] = useState(post.content);

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
        <View style={styles.messageContainer}>
            <View style={styles.headerContainer}>
                <Image source={require('../assets/avatar-1.jpg')} style={styles.avatar} />
                <View style={styles.authorInfo}>
                    <Text style={styles.messageInfos}>
                        {post.author.firstname} @{post.author.username} - {new Date(post.creationDate).toLocaleString()}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
                        <FontAwesome name="edit" size={24} color="#4A7B59" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeletePress} style={styles.deleteIcon}>
                        <FontAwesome name="trash" size={24} color="#4A7B59" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.messageContentContainer}>
                <Text style={styles.title2}>{post.title}</Text>
                <Text style={styles.messageContent}>{post.content}</Text>
                {post.images.map((imagePath, index) => (
                    <Image key={index} source={{ uri: imagePath }} style={styles.image} />
                ))}
            </View>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Suppression</Text>
                        <Text color='white'>Voulez-vous vraiment supprimer ce post ?</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Oui" color="#67AFAC" onPress={handleConfirmDelete} />
                            <Button title="Non" color="#67AFAC" onPress={handleCancelDelete} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={isEditing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier le Post</Text>
                        <TextInput
                            placeholder="Titre"
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Contenu"
                            value={editedContent}
                            onChangeText={setEditedContent}
                            style={styles.input}
                            multiline
                        />
                        <Button title="Sauvegarder" color="#67AFAC" onPress={handleConfirmEdit} />
                        <Button title="Annuler" color="#67AFAC" onPress={() => setIsEditing(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default function ClassScreen() {
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const teacher = useSelector((state) => state.teacher.value);

    const fetchPosts = () => {
        fetch('http://localhost:3000/posts')
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    const sortedPosts = data.posts.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
                    setPosts(sortedPosts);
                } else {
                    console.error(data.error);
                }
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = (postId) => {
        fetch(`http://localhost:3000/posts/${postId}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setPosts(posts.filter(post => post._id !== postId));
                } else {
                    console.error("Erreur de suppression :", result.error);
                }
            });
    };

    const handleUpdatePost = (postId, newTitle, newContent) => {
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setPosts(posts.map(post => post._id === postId ? result.post : post));
                } else {
                    console.error("Erreur de mise à jour :", result.error);
                }
            });
    };

    const handleAddPost = () => {
        if (newTitle.length > 40 || newContent.length > 180) {
            alert("Le titre et le contenu doivent chacun être limités à 180 caractères.");
            return;
        }

        const newPost = {
            title: newTitle,
            content: newContent,
            images: selectedImage ? [selectedImage] : [],
            creationDate: new Date(),
            author: {
                id: teacher.id,
                username: teacher.username,
                firstname: teacher.firstname,
            },
            classes: [],
            isRead: false,
        };

        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setPosts([result.post, ...posts]);
                    setModalVisible(false);
                    setNewTitle('');
                    setNewContent('');
                    setSelectedImage(null);
                } else {
                    console.error("Erreur d'ajout :", result.error);
                }
            });
    };

    const pickImage = async () => {
        // Request permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.uri);
        }
    };

    // Fonction pour prendre une photo avec la caméra
    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permission d'accès à la caméra requise !");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);  // Définir l'URI de l'image capturée
        }
    };

    return (
        <KeyboardAvoidingView style={globalStyles.mainContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
                <Text style={styles.titleClass}>Classe</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Text style={styles.textButton}>Ajouter un Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 15 }}>
                <View>
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
                        <Text style={styles.charCount}>{40 - newTitle.length} caractères restants</Text>

                        <TextInput
                            placeholder="Contenu"
                            value={newContent}
                            onChangeText={setNewContent}
                            style={styles.input}
                            multiline
                        />
                        <Text style={styles.charCount}>{180 - newContent.length} caractères restants</Text>
                        <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={takePhoto} style={styles.attachmentIcon}>
                                <FontAwesome name="camera" size={24} color="#69AFAC" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} style={styles.attachmentIcon}>
                                <FontAwesome name="paperclip" size={24} color="#69AFAC" />
                            </TouchableOpacity>

                        </View>
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                            <Text style={styles.buttonText}>Ajouter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity >
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#67AFAC',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        color: 'black',
        fontSize: 12,
    },
    title2: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#67AFAC',
    },
    messageContent: {
        fontSize: 14,
        marginVertical: 5,
        color: '#67AFAC',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 20,
        marginTop: 5,
    },
    deleteIcon: {
        paddingLeft: 10,
        marginRight: 10,
        color: '#C6D387',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        color: 'white',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#69AFAC',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        color: '#67AFAC',
    },
    titleClass: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color: '#67AFAC',
        textAlign: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    attachmentIcon: {
        padding: 10,
    },
    buttonText: {
        color: '#67AFAC',
    }
});

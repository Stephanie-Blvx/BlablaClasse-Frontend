import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

const Message = ({ post, postId, onDeletePost }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeletePress = () => setModalVisible(true);
    const handleConfirmDelete = () => {
        onDeletePost(postId);
        setModalVisible(false);
    };
    const handleCancelDelete = () => setModalVisible(false);

    const imageMapping = {
        "assets/photos/sortie-vélo.jpg": require('../assets/photos/sortie-vélo.jpg'),
        "assets/photos/sortie-piscine.jpg": require('../assets/photos/sortie-piscine.jpg'),
        "assets/photos/sortie-louvre.jpg": require('../assets/photos/sortie-louvre.jpg'),
        "assets/photos/journée-dodo.jpg": require('../assets/photos/journée-dodo.jpg'),
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
                <TouchableOpacity onPress={handleDeletePress} style={styles.deleteIcon}>
                    <FontAwesome name="trash" size={24} color="#4A7B59" />
                </TouchableOpacity>
            </View>
            <View style={styles.messageContentContainer}>
                <Text style={styles.title2}>{post.title}</Text>
                <Text style={styles.messageContent}>{post.content}</Text>
                {post.images.map((imagePath, index) => (
                    <Image key={index} source={imageMapping[imagePath]} style={styles.image} />
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
        </View>
    );
};

export default function ClassScreen() {
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const teacher = useSelector((state) => state.teacher.value);
    console.log(teacher)

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
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setPosts(posts.filter(post => post._id !== postId));
                } else {
                    console.error("Erreur de suppression :", result.error);
                }
            });
    };

    const handleAddPost = () => {
        const newPost = {
            title: newTitle,
            content: newContent,
            images: [], // Si vous avez des images, ajoutez-les ici
            creationDate: new Date(),
            author: { // Correction de la structure de l'auteur
                id: teacher.token, // Assurez-vous que le token est l'ObjectId de l'auteur
                username: teacher.username,
                firstname: teacher.firstname,
            },
            classes: [], // Ajoutez des classes si nécessaire
            isRead: false, // Mettez la valeur par défaut à false
        };
        console.log(newPost);
        

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
                } else {
                    console.error("Erreur d'ajout :", result.error);
                }
            });
    };

    return (
        <KeyboardAvoidingView style={globalStyles.mainContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
                <Text style={globalStyles.title}>Classe</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Text style={styles.textButton}>Ajouter un Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    {posts.map((post) => (
                        <Message
                            key={post._id}
                            post={post}
                            postId={post._id}
                            onDeletePost={handleDeletePost}
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
                        <TextInput
                            placeholder="Contenu"
                            value={newContent}
                            onChangeText={setNewContent}
                            style={styles.input}
                            multiline
                        />
                        <TouchableOpacity style={styles.attachmentIcon}>
                            <FontAwesome name="paperclip" size={24} color="#000" />
                        </TouchableOpacity>
                        <Button title="Ajouter" color="#67AFAC" onPress={handleAddPost} />
                        <Button title="Annuler" color="#67AFAC" onPress={() => setModalVisible(false)} />
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
        backgroundColor: '#67AFAC',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
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
        fontSize: 14,
        color: '#F9F2D9',
    },
    title2: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
    messageContent: {
        fontSize: 14,
        marginVertical: 5,
        color: 'white',
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
        backgroundColor: '#67AFAC',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        color: 'white',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
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
    },
});
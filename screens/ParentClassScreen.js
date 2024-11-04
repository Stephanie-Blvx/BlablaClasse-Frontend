import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, SafeAreaView, Platform,  TouchableOpacity, ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {CheckBox} from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const BACK_URL = 'http://192.168.3.174:3000';
const MessageWithCheckbox = ({ post, postId, onToggleReadStatus }) => {
    const [isChecked, setIsChecked] = useState(post.isRead); 


    const handleCheckboxChange = (newValue) => {
        setIsChecked(newValue); // Mettre à jour l’état local de la checkbox
        onToggleReadStatus(postId, newValue); // Appeler la fonction pour mettre à jour dans la DB
    };

    //Mapping pour rendu temporaire des images en fonction du post. Prévoir de mettre les images sur Cloudinary.
    const imageMapping = {
        "assets/photos/sortie-vélo.jpg": require('../assets/photos/sortie-vélo.jpg'),
        "assets/photos/sortie-piscine.jpg": require('../assets/photos/sortie-piscine.jpg'),
        "assets/photos/sortie-louvre.jpg": require('../assets/photos/sortie-louvre.jpg'),
        "assets/photos/journée-dodo.jpg": require('../assets/photos/journée-dodo.jpg'),
    };

    return (
        <View style={[styles.messageContainer, { backgroundColor: isChecked ? '#8DBFA9' : '#F9F2D9' }]}>
            <Image
                source={'/assets/avatar-1.jpg'}
                style={styles.avatar}
            />
            <View style={styles.messageContentContainer}>
                <Text styles={styles.messageInfos}>{post.author.firstname} @{post.author.username} - {new Date(post.creationDate).toLocaleString()}</Text>
                <Text styles={styles.title2}>{post.title}</Text>
                <Text style={styles.messageContent}>{post.content}</Text>
                {post.images.map((imagePath, index) => (
                    <Image key={index} source={imageMapping[imagePath]} style={styles.image} />
                ))}
            </View>
                <CheckBox
                    value={isChecked}
                    onValueChange={handleCheckboxChange}
                    style={styles.checkbox}
                />
        </View>
    );
};

export default function ParentClassScreen() {
    const [posts, setPosts] = useState([]);
    const parent = useSelector((state) => state.parent.value);
    const childName = parent.kids[0].firstname;

    

    // Fetch des posts dans la db
    const fetchPosts = () => {
        fetch('http://localhost/posts')
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    const sortedPosts = data.posts.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
                    setPosts(sortedPosts); 
                } else {
                    console.error(data.error);
                }
            });
    }

    // appeler fetchPosts dès le premier rendu de la page
    useEffect(() => {
        fetchPosts();
    }, []);

    // Mise à jour de isRead dans la db
    const handleToggleReadStatus = (postId, isRead) => {
        console.log(`Updating postId: ${postId} to isRead: ${isRead}`);
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
        <KeyboardAvoidingView style={globalStyles.mainContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
                <Text style={globalStyles.title}>Classe de {childName}</Text>
            </View>
            <ScrollView>
            <View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageContentContainer: {
        flex: 1,
    },
    messageContent: {
        fontSize: 14,
    },
    checkboxContainer: {
        justifyContent: 'center', 
        paddingHorizontal: 8,
    },
    checkbox: {
        alignSelf: 'center',
    },
    image: {
        width: '80%', 
        height: 200, 
        resizeMode: 'cover', 
        borderRadius: 5,
    },
});
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import {CheckBox} from 'react-native';

const MessageWithCheckbox = ({ post, postId, onToggleReadStatus }) => {
    const [isChecked, setIsChecked] = useState(post.isRead); 

    const handleCheckboxChange = (newValue) => {
        setIsChecked(newValue); // Mettre à jour l’état local de la checkbox
        onToggleReadStatus(postId, newValue); // Appeler la fonction pour mettre à jour dans la DB
    };

    return (
        <View style={styles.messageContainer}>
            <Image
                source={'/assets/avatar-1.jpg'}
                style={styles.avatar}
            />
            <View style={styles.messageContentContainer}>
                <Text>{post.author.firstname} @{post.author.username} - {new Date(post.creationDate).toLocaleString()}</Text>
                <Text style={styles.messageContent}>{post.content}</Text>
                <CheckBox
                    value={isChecked}
                    onValueChange={handleCheckboxChange}
                    style={styles.checkbox}
                />
            </View>
        </View>
    );
};

export default function ClassScreen() {
    const [posts, setPosts] = useState([]);
    const [childName, setChildName] = useState('Lucas'); // A CORRIGER POUR METTRE EN DYNAMIQUE

    // Fetch des posts dans la db
    const fetchPosts = () => {
        fetch('http://localhost:3000/posts')
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    setPosts(data.posts);
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
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View>
                <Text style={styles.header}>Classe de {childName}</Text>
            </View>
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
    checkbox: {
        alignSelf: 'center',
    },
});
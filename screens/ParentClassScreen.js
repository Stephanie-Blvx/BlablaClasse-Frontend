import { Text, View, Image, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import  Checkbox  from 'expo-checkbox';
import { globalStyles } from '../styles/globalStyles';
import { classeStyles } from '../styles/classeStyles';
const BACK_URL = 'http://localhost:3000';

    const MessageWithCheckbox = ({ post, postId, onToggleReadStatus }) => {
        const [isChecked, setIsChecked] = useState(post.isRead);
    
        const handleCheckboxChange = (newValue) => {
            setIsChecked(newValue); // Mettre à jour l’état local de la checkbox
            onToggleReadStatus(postId, newValue); // Appeler la fonction pour mettre à jour dans la DB
        };
    
        return (
            <View style={[classeStyles.messageContainer, { backgroundColor: isChecked ? '#69AFAC' : 'white' }]}>
                <View style={classeStyles.headerContainer}>
                    <Image source={require('../assets/avatar-1.jpg')} style={classeStyles.avatar} />
                    <View style={classeStyles.authorInfo}>
                        <Text style={classeStyles.messageInfos}>
                            {post.author.firstname} @{post.author.username}   
                        </Text>
                        <Text>{new Date(post.creationDate).toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity>
                        <Checkbox value={isChecked} onValueChange={handleCheckboxChange} style={classeStyles.checkbox} />
                    </TouchableOpacity>
                </View>
                <View style={classeStyles.messageContentContainerParent}>
                    <Text style={[classeStyles.title2, { color: isChecked ? 'black' : '#69AFAC' }]}>{post.title}</Text>
                    <Text style={[classeStyles.messageContent, { color: isChecked ? 'black' : '#69AFAC' }]}>{post.content}</Text>
                    {post.images.map((imageUrl, index) => (
                        <Image key={index} source={{ uri: imageUrl }} style={classeStyles.image} />
                    ))}
                </View>
            </View>
        );
    };

export default function ParentClassScreen() {
    const [posts, setPosts] = useState([]);
    const parent = useSelector((state) => state.parent.value);
    const childName = parent.kids[0].firstname;



    // Fetch des posts dans la db
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
                <Text style={classeStyles.titleClass}>Classe de {childName}</Text>
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
import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, SafeAreaView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckBox } from 'react-native';
import { globalStyles } from '../styles/globalStyles';


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
        <View style={[styles.messageContainer, { backgroundColor: isChecked ? '#69AFAC' : 'white' },]}>
            <View style={styles.headerContainer}>
                <Image source={require('../assets/avatar-1.jpg')} style={styles.avatar} />
                <View style={styles.authorInfo}>
                    <Text style={styles.messageInfos}>
                        {post.author.firstname} @{post.author.username}   
                    </Text>
                    <Text>{new Date(post.creationDate).toLocaleString()}</Text>
                </View>
                <TouchableOpacity>
                    <CheckBox value={isChecked} onValueChange={handleCheckboxChange} style={styles.checkbox} />
                </TouchableOpacity>
            </View>
            <View style={styles.messageContentContainer}>
                <Text style={[styles.title2, { color: isChecked ? 'black' : '#69AFAC' },]}>{post.title}</Text>
                <Text style={[styles.messageContent, { color: isChecked ? 'black' : '#69AFAC' }]}>{post.content}</Text>
                {post.images.map((imagePath, index) => (
                    <Image key={index} source={imageMapping[imagePath]} style={styles.image} />
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
                <Text style={styles.titleClass}>Classe de {childName}</Text>
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
            marginBottom: 5,
        },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageInfos: {
        fontSize: 14,
        color: 'black',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5,
    },
    messageContentContainer: {
        flex: 1,
    },
    titleClass:{
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color:'#69AFAC',
        textAlign: 'center',
      },
    title2: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#69AFAC',
    },
    messageContent: {
        fontSize: 14,
        color: '#69AFAC',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 20,
        marginTop: 5,
    },
    checkbox: {
        alignSelf: 'center',
        marginLeft: 5,

    },
});
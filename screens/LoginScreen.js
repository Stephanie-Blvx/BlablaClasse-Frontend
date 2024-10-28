import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, SafeAreaView, Platform, RegExp, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    // email Regex
    const emailRegex= new RegExp ( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    function handleConnexion() {
        if (!emailRegex.test(email)) { setIsValidEmail(false); return; }
        fetch ("http:.../signin",  // fetch route login

          {method:"POST",  
          headers:{'content-type':'application/json'}, 
          body: JSON.stringify({ 
            email: email,
            password : 'A COMPLETER', // compléter password
          })
        })
          .then (response=>response.json()) 
          .then (dbData=>{  console.log("dbData",dbData) ; 

                            if (dbData) {navigation.navigate("TabNavigator")}; // à affiner
          });
        
    };

    //-------------------------------------------------JSX------------------------------------------
    return (
        // contenu de la page = mainContainer

        <   KeyboardAvoidingView style={styles.mainContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

            {/* contenu du titre = titleFrame*/}

            <View style={styles.titleFrame}>
                <Text style={styles.screenTitle}>Se connecter</Text>
            </View>

            {/* contenu sous le titre = contentFrame */}

            {/* <View style={styles.contentFrame}> */}

            <TouchableOpacity //champ cliquable renvoi vers QRCode scanner
                style={styles.transparentButton}
                onPress={() => navigation.navigate('QrCodeScanner')} >
                <Text style={styles.inputText}>Je scanne un QR Code</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput //champ d'input email
                    style={styles.inputText}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                />
            </View>

            {!isValidEmail && <Text style={styles.error}>Invalid email address</Text>}

            <View style={styles.inputContainer}>
                <TextInput //champ d'input password
                    style={styles.inputText}
                    placeholder="Password"
                    onChangeText={value => setPassword(value)}
                    value={password}
                />
            </View>

            <TouchableOpacity //champ cliquable renvoi vers QRCode scanner
                style={styles.button}
                onPress={() => handleConnexion()} >
                <Text style={styles.inputText}>Connexion</Text>
            </TouchableOpacity>

            {/* </View > */}

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        // marginBottom: 50,
    },
    titleFrame: {
        flex: 0.2,
        fontSize: 30,
        fontWeight: '200', // Le poids de la police doit être une chaîne
        borderBottomWidth: 1,
        borderBottomColor: 'dimgrey',
        margin: 50,
    },
    screenTitle: {
        fontSize: 30,
    },
    transparentButton: {
        width: '90%',
        backgroundColor: 'white',
        borderWidth: 1, // Corrigé de "borderwidth" à "borderWidth"
        borderColor: "#696969",
        paddingHorizontal: 50,
        alignItems: 'center',
    },
    error: {
        marginTop: 10,
        color: 'red',
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#696969',
        height: 40,
        width: 350,
        padding: 10,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#696969',
        height: 40,
        width: 350,
    },
    button: {
        alignItems: 'center',
        paddingTop: 8,
        width: '20%',
        margin: 30,
        backgroundColor: '#69AFAC',
        borderRadius: 5,
    },
});


    // texteAccueil: {
    //     width: '80%',
    //     fontSize: 50,
    //     textAlign: 'center',
    // },



import { Button, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, SafeAreaView, Platform,  TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/parent.js';

const BACKEND_ADDRESS = 'http://192.168.5.28:3000'; //-------> url Backend


// email Regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const dispatch = useDispatch();
    const parent = useSelector((state) => state.parent.value);
      
    function handleConnexion() {
        if (!emailRegex.test(email)) { setIsValidEmail(false); return; }
        fetch (`${BACKEND_ADDRESS}/parents/signin`,  // fetch route parents/signin

          {method:"POST",  
          headers:{'Content-Type':'application/json'}, 
          body: JSON.stringify({ 
            email: email,
            password : password, 
          })
        })
          .then (response=>response.json()) 
          .then (dbData=>{  console.log("dbData",dbData) ; // afficher la réponse de la route / dataBase
                            if (!dbData.result){setIsValidEmail(false)} //si result : false, message erreur email
                            
                            else {console.log(dbData);
                                dispatch(login({token:dbData.token, email:dbData.email})); //si result = OK, MàJ reducer "parent" avec token et firstname
                                navigation.navigate('TabNavigator')}
                            })
        };
        console.log("parent",parent);
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
                // onPress={() => navigation.navigate('QRCodeScanner')} //naviguer vers page QRCodeScanner lorsqu'on l'aura
                >
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

            {!isValidEmail && <Text style={styles.error}>Invalid email address or password</Text>}

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
        fontWeight: '200',
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
        borderWidth: 1, 
        borderColor: "#696969",
        paddingHorizontal: 50,
        alignItems: 'center',
    },
    error: {
        marginTop: 10,
        color: 'red',
    },
    inputText: {
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
        width: '80%',
        margin: 30,
        backgroundColor: '#69AFAC',
        borderRadius: 5,
        color: 'white'
    },
});




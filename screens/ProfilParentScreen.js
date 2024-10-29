import React, { useState } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, SafeAreaView, Platform, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { buttonStyles } from '../styles/buttonStyles';
import { globalStyles } from '../styles/globalStyles';

// Composant principal pour l'écran de profil
export default function ProfilParentScreen() {
    // États pour gérer les valeurs des champs de formulaire
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [allergies, setAllergies] = useState('');
    const [habits, setHabits] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    // Fonction de validation du formulaire
    const handleValidation = () => {
        // Logique de validation ou envoi des données
        console.log("Formulaire validé");
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            {/* Modifier la couleur de la barre d'état */}
            <StatusBar barStyle="light-content" backgroundColor="#8DBFA9" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={40}>
                <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                    <View style={globalStyles.container}>
                        <Text style={globalStyles.title}>Profil parent</Text>

                        {/* Champ de saisie pour le prénom de l'enfant */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                                placeholder="Nom du prénom"
                                value={firstname}
                                onChangeText={setFirstname}
                                editable={false}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Champ de saisie pour le nom de l'enfant */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                                placeholder="Nom du parent"
                                value={lastname}
                                onChangeText={setLastname}
                                editable={false}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Champ de saisie pour la date de naissance */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={[buttonStyles.input, buttonStyles.inputDisabled]}
                                placeholder="Date de naissance"
                                value={birthdate}
                                onChangeText={setBirthdate}
                                editable={false}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Champ de saisie pour les allergies */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={buttonStyles.input}
                                placeholder="Allergies"
                                value={allergies}
                                onChangeText={setAllergies}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Champ de saisie pour les habitudes */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={buttonStyles.input}
                                placeholder="Habitudes"
                                value={habits}
                                onChangeText={setHabits}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Champ de saisie pour les informations supplémentaires */}
                        <View style={buttonStyles.inputContainer}>
                            <TextInput
                                style={buttonStyles.input}
                                placeholder="Informations diverses"
                                value={additionalInfo}
                                onChangeText={setAdditionalInfo}
                                placeholderTextColor='#5e5e5e8a'
                            />
                        </View>

                        {/* Bouton de validation du formulaire */}
                        <View style={buttonStyles.buttonContainer}>
                            <TouchableOpacity style={buttonStyles.button} onPress={handleValidation}>
                                <Text style={buttonStyles.buttonText}>VALIDER</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
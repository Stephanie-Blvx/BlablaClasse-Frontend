import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, Alert, StatusBar, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { globalStyles } from "../styles/globalStyles";
const BACK_URL = 'http://192.168.1.30:3000';

const BACKEND_ADDRESS = "http://192.168.5.28:3000"; //-------> url Backend
//const BACKEND_ADDRESS = "http://localhost:3000"; //-------> url Backend

//Lien pour dl menu
const fileUri = `${FileSystem.documentDirectory}menu.jpg`



export default function ParentHomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastActu, setLastActu] = useState([])
  const [menu, setMenu] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

// Configuration Calendar en FR
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  monthNamesShort: [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: 'Aujourd\'hui',
};

// Définir la locale actuelle
LocaleConfig.defaultLocale = 'fr';

  //------------CALENDAR---------------------//
  // Transformer les événements en dates marquées
  const transformEventsToMarkedDates = (events) => {
    const dates = {};
    events.forEach(event => {
      const date = new Date(event.date).toISOString().split('T')[0];

      // Création d'un dot pour la classe associée à l'événement
      const dot = event.classe && event.classe.color ? { color: event.classe.color } : { color: 'blue' };

      // Initialiser la date si elle n'existe pas encore dans `dates`
      if (!dates[date]) {
        dates[date] = { marked: true, dots: [], events: [] };
      }

      // Ajouter le dot et l'événement
      dates[date].dots.push(dot);
      dates[date].events.push(event);
    });

    return dates;
  };
  //-----Route get : all events à afficher ---
  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/events`)
      .then((response) => response.json())
      .then((data) => {
        console.log("------data-----", data)
        const dates = transformEventsToMarkedDates(data.events);
        setMarkedDates(dates);

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des événements :", error);
      });
  }, []);



  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // DATES EN JJ-MM-AA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };



  const selectedDateEvents = markedDates[selectedDate]?.events || [];



  // ----------------ROUTE GET DERNIèRE ACTU A AFFICHER-----------
  // Fetch des posts dans la db
  const fetchActu = () => {
    fetch(`${BACKEND_ADDRESS}/actus`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("LAST ACTU", data.actu.content)
          const lastActuToShow = data.actu.content
          setLastActu(lastActuToShow)
          console.log("LAST ACTU", data)
        } else {
          console.error(data.error);
        }
      });
  }

  // appeler fetchPosts dès le premier rendu de la page
  useEffect(() => {
    fetchActu();
  }, [lastActu]);


  // PERMISSION GESTIONNAIRE FICHIERS
  useEffect(() => {
    (async () => {
      const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);;
      if (result) {
        setHasPermission(result.status === "granted");
      }
    })();
  }, []);


  ///----- Fonction pour DOWNLOAD menu cantine------

  const downloadMenu = async () => {
    //utiiser await 
    const response = await fetch(`${BACK_URL}/menus`);
    const data = await response.json();

    if (data.result) {
      console.log("LAST MENU URL", data);
      const lastMenuUrl = data;
      setMenu(lastMenuUrl);
      console.log("LAST MENU", menu.menu.url);
    } else {
      console.error(data.error);
    }
    // Demander la permission d'accéder à la galerie
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      console.log('WHAT', menu.menu.url)

      // ---Télécharger le fichier---
      const result = await FileSystem.downloadAsync(menu.menu.url, fileUri);
      console.log('RESULT', result)
      console.log("Fichier téléchargé avec succès :", result.uri);


      // Enregistrer le fichier dans la galerie
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      Alert.alert('Téléchargement terminé', `Le fichier a été enregistré dans la galerie : ${asset.uri}`);
    } else {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour enregistrer le fichier.');
    }

  };
  ///JSX///

  return (
    <SafeAreaView style={[globalStyles.safeArea]}>
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
         <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
    <View style={globalStyles.container}>
      <View style={[styles.header, globalStyles.container]}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Text style={globalStyles.title}>Quoi de neuf ?</Text>
      </View>

      <Calendar
        firstDay={1}
        onDayPress={onDayPress}
        current={currentDate}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          selectedDayBackgroundColor: '#67AFAC',
          todayTextColor: '#67AFAC',
          arrowColor: '#67AFAC',
        }}
        locale={"fr"}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Événements du {formatDate(selectedDate)}
          </Text>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text>Classe : {event.classe?.name} </Text>
                <Text>Événement : {event.description}</Text>
              </View>
            ))
          ) : (
            <Text>Aucun événement pour cette date.</Text>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
            <Text style={{ color: '#67AFAC' }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Dernière actu de l'école */}
      <View style={styles.lastActuContainer}>
        <Text style={styles.actuTitle}> Dernière actu : </Text>
        <Text style={styles.actuContent}>{lastActu}</Text>
      </View>
      {/* Télécharger le menu cantine > PARENT < */}
      <View style={styles.buttonPlace}>
        <TouchableOpacity onPress={() => downloadMenu()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>  🍽️ Télécharger le menu de la cantine </Text>
        </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {

    // height: 60,
    // flexDirection: 'row',
    // alignItems: 'center',
    //marginBottom: 20,


  },
  titleHome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#69AFAC',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,

  },
  logo: {
    width: 70,
    height: 70,
    //marginRight: 10,
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },


  input: {
    width: 200,
    borderBottomColor: '#69AFAC',
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  buttonPlace: {

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 36,
    marginLeft: 30,

  },
  button: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,


  },
  textButton: {
    color: "#69AFAC",
    fontSize: 12,
    fontWeight: "600",
  },
  lastActuContainer: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#69AFAC",
    borderRadius: 10,
    padding: 10,
    marginTop: 40,
    alignItems: 'center',


  },
  actuTitle: {
    textDecorationLine: 'underline',
    color: "#69AFAC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,

  },
  actuContent: {
    color: "#69AFAC",
    fontSize: 12,
    fontWeight: "600",

  },


});

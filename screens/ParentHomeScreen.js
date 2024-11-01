import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
//import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

const BACK_URL = 'http://localhost:3000';

export default function ParentHomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const dispatch = useDispatch();
  //USESELECTOR MENU
  const menu = useSelector((state) => state.menu.value.menus);
  console.log("MENU USESELECTOR", menu)


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
  //Route get : all events à afficher 
  useEffect(() => {
    fetch(`${BACK_URL}/events`)
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

  const selectedDateEvents = markedDates[selectedDate]?.events || [];



  // PERMISSION GESTIONNAIRE FICHIERS
  useEffect(() => {
    (async () => {
      const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);;
      if (result) {
        setHasPermission(result.status === "granted");
      }
    })();
  }, []);


  /// Fonction pour DOWNLOAD menu cantine

  const downloadMenu = async () => {
    try {
      const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:]/g, '').split('.')[0]; // Format: YYYYMMDDTHHmmss

      const lastMenuUrl = menu[menu.length - 1];
      console.log("URL du dernier menu :", lastMenuUrl);

      const filename = `menu_${formattedDate}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;

      // Télécharger le fichier
      const result = await FileSystem.downloadAsync(lastMenuUrl, fileUri);
      console.log("Fichier téléchargé avec succès :", result.uri);

      // Demander la permission d'accéder à la galerie
      const { status } = await MediaLibrary.requestPermissionsAsync(); "uploadMenu"
      if (status === 'granted') {
        // Enregistrer le fichier dans la galerie
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        Alert.alert('Téléchargement terminé', `Le fichier a été enregistré dans la galerie : ${asset.uri}`);
      } else {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour enregistrer le fichier.');
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement du fichier.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      
        <Text style={styles.titleHome}> Quoi de neuf dans notre école ? </Text>
      
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          selectedDayBackgroundColor: '#67AFAC',
          todayTextColor: '#67AFAC',
          arrowColor: '#67AFAC',
        }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Événements du {selectedDate}
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
      {/* Télécharger le menu cantine > PARENT < */}
      <TouchableOpacity onPress={() => downloadMenu()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}> Menu de la cantine </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  titleHome:{
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color:'#69AFAC',
    alignItems:'center',
    justifyContent:'center',
  },
  input: {
    width: 200,
    borderBottomColor: '#69AFAC',
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#69AFAC",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { addEvent, removeEvent } from '../reducers/event';
import { addMenu } from '../reducers/menu';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

const BACK_URL = 'http://192.168.1.30:3000';

export default function TeacherHomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Teacher View
  const [modalEventVisible, setModalEventVisible] = useState(false);
  const [modalActuVisible, setModalActuVisible] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [classe, setClasse] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classes, setClasses] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [actus, setActus] = useState([]);

  const dispatch = useDispatch();
  //USESELECTOR 
  const menu = useSelector((state) => state.menu.value.menu);
  console.log("MENU USESELECTOR", menu)
  const teacher = useSelector((state) => state.teacher.value);

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

  //Route get : recupère les classes pour que teacher puisse create new event
  useEffect(() => {
    fetch(`${BACK_URL}/classes`)
      .then((response) => response.json())
      .then((data) => {
        console.log("classes", data)
        setClasses(data.classes);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des classes :", error);
      });
  }, []);


  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const selectedDateEvents = markedDates[selectedDate]?.events || [];

  // Ouvre le modal 
  const handleOpenModal = () => {
    setModalEventVisible(true);
  };

  // Ferme le modal 
  const handleClose = () => {
    setModalEventVisible(false);
    setNewEvent('');
    setClasse('');
    setNewDate('');
  };

  // Route POST Ajoute un nouvel événement en BDD
  const handleNewEvent = () => {
    fetch(`${BACK_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classe: classe, date: newDate, description: newEvent }) // Assurez-vous que classe est l'ID de la classe
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          // Ici, vous devez également récupérer la classe correspondante
          const selectedClass = classes.find(item => item._id === classe); // Récupérer l'objet classe
          const newEventData = {
            classe: selectedClass, // Incluez l'objet classe complet
            date: newDate,
            description: newEvent
          };

          // Dispatch de l'événement dans Redux
          dispatch(addEvent(newEventData));

          // Mettre à jour les markedDates
          const updatedMarkedDates = {
            ...markedDates,
            ...transformEventsToMarkedDates([newEventData]) // Ajouter le nouvel événement pour le marquer
          };
          setMarkedDates(updatedMarkedDates);

          // Réinitialiser les champs du modal
          setModalEventVisible(false);
          setNewEvent('');
          setClasse('');
          setNewDate('');
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de l'événement :", error);
      });
  };

  // Ouvre le DateTimePicker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // Gestion de la sélection de date dans le DateTimePicker
  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      const formattedDate = selected.toISOString().split('T')[0];
      setNewDate(formattedDate);
    }
  };

  // PERMISSION GESTIONNAIRE FICHIERS
  useEffect(() => {
    (async () => {
      const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);;
      if (result) {
        setHasPermission(result.status === "granted");
      }
    })();
  }, []);


  /// Fonction pour UPLOAD menu cantine

  const uploadMenu = async () => {

    const newMenu = await DocumentPicker.getDocumentAsync({
      type: 'image/jpeg',
    });
    const formData = new FormData();
    console.log("MENU.URI", newMenu)
    formData.append('menuFromFront', {
      uri: newMenu.assets[0].uri,
      name: 'menu.jpg',
      type: 'image/jpeg',
    });

    fetch(`${BACK_URL}/menus`, {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("DATA>>>>>>>>>>", data)
          data.result && dispatch(addMenu(data.url));
          Alert.alert('Info', 'menu ajouté avec succès');
        }

      });
  }



  //PUBLICATION D'UNE ACTU

  const handleAddActu = () => {
    const newActu = {

      content: newContent,

    }



    fetch(`${BACK_URL}/actus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActu),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setActus([result.actu, ...actus]);
          setModalActuVisible(false);
          setNewContent('');
        } else {
          console.error("Erreur d'ajout :", result.error);
        }
      });
  };

  //JSX

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <View style={styles.header}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Text style={styles.titleHome}> Quoi de neuf dans notre école ? </Text>
      </View>

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


      {/* TEACHER VIEW  ---- Modal pour nouvel événement */}

      <TouchableOpacity onPress={() => handleOpenModal()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Nouvel évenement</Text>
      </TouchableOpacity>

      <Modal visible={modalEventVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginBottom: 10 }}>Nouvel évenement :</Text>
            <Picker selectedValue={classe} onValueChange={(itemValue) => setClasse(itemValue)} style={styles.input}>
              <Picker.Item label="Classe" value="" />
              {classes.map((classe) => (
                <Picker.Item key={classe._id} label={classe.name} value={classe._id} />
              ))}
            </Picker>
            <TouchableOpacity onPress={openDatePicker} style={styles.input}>
              <Text style={{ color: newDate ? '#000' : '#888' }}>{newDate || "Sélectionner une date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <TextInput placeholder="Description de l'événement" onChangeText={(value) => setNewEvent(value)} value={newEvent} style={styles.input} />
            <TouchableOpacity onPress={() => handleNewEvent()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>   Ajouter   </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>   Fermer   </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* AFFICHAGE NOUVELLE ACTU*/}
      {/* POST NOUVELLE ACTU*/}
      {teacher.isAdmin && (
  <View style={[styles.actuContainer]}>
    <Modal visible={modalActuVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ajouter une actualité</Text>
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
          <Button title="Ajouter" color="#67AFAC" onPress={handleAddActu} />
          <Button title="Annuler" color="#67AFAC" onPress={() => setModalActuVisible(false)} />
        </View>
      </View>
    </Modal>
  </View>
)}
      {/* UPLOAD MENU CANTINE*/}
      <TouchableOpacity onPress={() => uploadMenu()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Ajouter le nouveau menu </Text>
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
  header: {

    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,


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
    marginRight: 10,
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
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
});

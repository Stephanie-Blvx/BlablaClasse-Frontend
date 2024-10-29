import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { addEvent, removeEvent } from '../reducers/event';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'

const BACK_URL = 'http://192.168.3.174:3000';

export default function HomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Teacher View
  const [modalEventVisible, setModalEventVisible] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [classe, setClasse] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classes, setClasses] = useState([]); // État pour stocker les classes

  const dispatch = useDispatch();
  const event = useSelector((state) => state.event.value);

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
        console.log("Marked Dates:", dates);
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
  /// TO DO >>> Bouton pour DL menu cantine

  return (
    <View style={{ flex: 1, padding: 20 }}>
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

      {/* Modal pour nouvel événement */}
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  Button,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { globalStyles } from "../styles/globalStyles";
import { buttonStyles } from "../styles/buttonStyles";
import { homeStyles } from "../styles/homeStyles";

const BACK_URL = 'http://192.168.3.174:3000';


//const BACK_URL = "http://192.168.1.30:3000";

export default function TeacherHomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastActu, setLastActu] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Teacher View
  const [modalEventVisible, setModalEventVisible] = useState(false);
  const [modalActuVisible, setModalActuVisible] = useState(false);
  const [newEvent, setNewEvent] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [classe, setClasse] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classes, setClasses] = useState([]);

  const [actus, setActus] = useState([]);

  //USESELECTOR à utiliser pour teacher ADMIN TO DO !!!
  const teacher = useSelector((state) => state.teacher.value);
  console.log("TEACHER ADMIN USE SELECTOR???", teacher);
  //-------------------------------------------------------------

  // Configuration Calendar en FR
  LocaleConfig.locales["fr"] = {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    today: "Aujourd'hui",
  };

  // Définir la locale actuelle
  LocaleConfig.defaultLocale = "fr";

  //------------CALENDAR---------------------//
  // Transformer les événements en dates marquées en dot
  const transformEventsToMarkedDates = (events) => {
    const dates = {};

    events.forEach((e) => {
      const date = new Date(e.date).toISOString().split("T")[0];

      //console.log("DATE", date)
      //toutes les dates des events qui ont été ajoutées
      // Création d'un dot pour la classe associée à l'événement
      const dot =
        e.classe && e.classe.color
          ? { color: e.classe.color }
          : { color: "blue" };
      console.log("DOTS", e);
      // Initialiser la date si elle n'existe pas encore dans `dates`
      if (!dates[date]) {
        dates[date] = { marked: true, dots: [], events: [] };
      }

      // Ajouter le dot et l'événement
      dates[date].dots.push(dot);
      dates[date].events.push(e);
      console.log("DATES", dates);
    });

    return dates;
  };
 // PERMISSION GESTIONNAIRE FICHIERS
 useEffect(() => {
  (async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la galerie pour enregistrer le fichier."
      );
    }
  })();
}, []);



  //Route get : all events à afficher
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${BACK_URL}/events`);
      const data = await response.json();
      const dates = transformEventsToMarkedDates(data.events);
      setMarkedDates(dates);
    };
    fetchEvents();
  }, []);

  //Route get : recupère les classes pour que teacher puisse create new event
  useEffect(() => {
    fetch(`${BACK_URL}/classes`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("classes", data)
        setClasses(data.classes);
      });
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };
  //modifier formate de date en JJ-MM-AA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const selectedDateEvents = markedDates[selectedDate]?.events || [];
  //-----------MODALS------------------
  // Ouvre le modal
  const handleOpenModal = () => {
    setModalEventVisible(true);
  };

  // Ferme le modal
  const handleClose = () => {
    setModalEventVisible(false);
    setNewEvent("");
    setClasse("");
    setNewDate("");
  };

  // Ouvre le modal new Actu
  const handleOpenActu = () => {
    console.log("TEACHER ADMIN ???", teacher.isAdmin);
    // Teacher isAdmin : true ?
    if (teacher.isAdmin) {
      setModalActuVisible(true);
    } else {
      Alert.alert(
        "Accès refusé",
        "Seule la direction peut ajouter des actualités."
      );
    }
  };

  // Ferme le modal  new Actu
  const handleCloseActu = () => {
    setModalActuVisible(false);
    setActus("");
  };
  //-------------------------------------

  // Route POST Ajoute un nouvel événement en BDD
  const handleNewEvent = () => {
    fetch(`${BACK_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classe: classe,
        date: newDate,
        description: newEvent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Ici, vous devez également récupérer la classe correspondante
          const selectedClass = classes.find((item) => item._id === classe);
          const newEventData = {
            _id: data.event._id,
            classe: selectedClass, // Incluez l'objet classe complet
            date: newDate,
            description: newEvent,
          };

          // Mettre à jour les markedDates
          const updatedMarkedDates = {
            ...markedDates,
            ...transformEventsToMarkedDates([newEventData]), // Ajouter le nouvel événement pour le marquer
          };
          setMarkedDates(updatedMarkedDates);

          // Réinitialiser les champs du modal
          setModalEventVisible(false);
          setNewEvent("");
          setClasse("");
          setNewDate("");
        }
      })
      .catch((error) => {
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
      const formattedDate = selected.toISOString().split("T")[0];
      setNewDate(formattedDate);
    }
  };

  //-------DELETE UN EVENT
  const deleteEvent = (eventId) => {
    fetch(`${BACK_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Mettre à jour les événements marqués après la suppression
          const updatedMarkedDates = { ...markedDates };

          // Parcourir chaque date marquée
          for (const date in updatedMarkedDates) {
            // Filtrer les événements pour enlever celui qui a été supprimé
            updatedMarkedDates[date].events = updatedMarkedDates[
              date
            ].events.filter((event) => event._id !== eventId);

            // Si aucun événement ne reste pour cette date, supprimer la date des dates marquées
            if (updatedMarkedDates[date].events.length === 0) {
              delete updatedMarkedDates[date];
            }
          }

          // Mettre à jour le MarkedDates
          setMarkedDates(updatedMarkedDates);
          Alert.alert("Succès", "Événement supprimé avec succès");
        } else {
          Alert.alert("Erreur", data.error || "Erreur de suppression");
        }
      });
  };

  // ----------------ROUTE GET DERNIèRE ACTU A AFFICHER-----------
  // Fetch des posts dans la db
  const fetchActu = () => {
    fetch(`${BACK_URL}/actus`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // console.log("LAST ACTU", data.actu.content)
          const lastActuToShow = data.actu.content;
          setLastActu(lastActuToShow);
          // console.log("LAST ACTU", data)
        } else {
          console.error(data.error);
        }
      });
  };

  // appeler last actu
  useEffect(() => {
    fetchActu();
  }, [actus]);

 

  /// Fonction pour UPLOAD menu cantine

  const uploadMenu = async () => {
    const newMenu = await DocumentPicker.getDocumentAsync({
      type: "image/jpeg",
    });
    const formData = new FormData();
    console.log("MENU.URI", newMenu);
    formData.append("menuFromFront", {
      uri: newMenu.assets[0].uri,
      name: "menu.jpg",
      type: "image/jpeg",
    });

    fetch(`${BACK_URL}/menus`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          //  console.log("DATA>>>>>>>>>>", data)
          Alert.alert("Info", "menu ajouté avec succès");
        }
      });
  };

  //PUBLICATION D'UNE ACTU

  const handleAddActu = () => {
    const newActu = {
      content: actus,
    };

    fetch(`${BACK_URL}/actus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActu),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setActus([actus]);
          setModalActuVisible(false);
          setActus("");
        } else {
          console.error("Erreur d'ajout :", data.error);
        }
      });
  };

  //JSX

  return (
    <SafeAreaView style={[globalStyles.safeArea]}>
      <StatusBar barStyle="light-content" backgroundColor="#67AFAC" />
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitleNoReturn}>Quoi de neuf ?</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={globalStyles.containerFull}>
            <Calendar
              firstDay={1}
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType={"multi-dot"}
              current={currentDate}
              theme={{
                selectedDayBackgroundColor: "#67AFAC",
                todayTextColor: "#67AFAC",
                arrowColor: "#67AFAC",
              }}
              locale={"fr"}
            />

            <Modal
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View
                style={homeStyles.containerAgenda}
              >
                <Text style={homeStyles.title}>
                  Événements du {formatDate(selectedDate)}
                </Text>

                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                      }}
                    >
                      <Text>Classe : {event.classe?.name} </Text>
                      <Text>Événement : {event.description}</Text>
                      <TouchableOpacity
                        onPress={() => deleteEvent(event._id)}
                        
                      >
                        <FontAwesome style={homeStyles.deleteIcon} name="trash" size={24} color="#4A7B59" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text>Aucun événement pour cette date.</Text>
                )}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 20 }}
                >
                  <Text style={{ color: "#67AFAC" }}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            {/* Dernière actu de l'école */}
            <View style={homeStyles.lastActuContainer}>
              <Text style={homeStyles.lastActuTitle}> Dernière actu : </Text>
              <Text style={homeStyles.lastActuContent}>{lastActu}</Text>
            </View>

            {/* TEACHER VIEW  ---- Modal pour nouvel événement */}
            <View style={homeStyles.teacherButtons}>
              <TouchableOpacity
                onPress={() => handleOpenModal()}
                style={homeStyles.button}
                activeOpacity={0.8}
              >
                <Text style={homeStyles.addButton}> Ajouter un évenement</Text>
              </TouchableOpacity>

              <Modal
                visible={modalEventVisible}
                animationType="fade"
                transparent
              >
                <View style={homeStyles.centeredView}>
                  <View style={homeStyles.modalView}>
                    <Text style={{ marginBottom: 10 }}>Nouvel évenement :</Text>
                    <Picker
                      selectedValue={classe}
                      onValueChange={(itemValue) => setClasse(itemValue)}
                      style={homeStyles.input}
                    >
                      <Picker.Item label="Classe" value="" />
                      {classes.map((classe) => (
                        <Picker.Item
                          key={classe._id}
                          label={classe.name}
                          value={classe._id}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      onPress={openDatePicker}
                      style={homeStyles.input}
                    >
                      <Text style={{ color: newDate ? "#000" : "#888" }}>
                        {newDate || "Sélectionner une date"}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                      />
                    )}
                    <TextInput
                      placeholder="Description de l'événement"
                      onChangeText={(value) => setNewEvent(value)}
                      value={newEvent}
                      style={homeStyles.input}
                    />
                    <View style={homeStyles.validationButtons}>
                      <TouchableOpacity
                        onPress={() => handleNewEvent()}
                        style={homeStyles.button}
                        activeOpacity={0.8}
                      >
                        <Text style={homeStyles.addButton}> Ajouter </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleClose()}
                        style={homeStyles.button}
                        activeOpacity={0.8}
                      >
                        <Text style={homeStyles.closedButton}> Fermer </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* POST NOUVELLE ACTU*/}

              <TouchableOpacity
                onPress={() => handleOpenActu()}
                style={homeStyles.button}
                activeOpacity={0.8}
              >
                <Text style={homeStyles.addButton}>Ajouter une actualité</Text>
              </TouchableOpacity>

              <Modal
                visible={modalActuVisible}
                animationType="fade"
                transparent
              >
                <View style={homeStyles.centeredView}>
                  <View style={homeStyles.modalView}>
                    <TextInput
                      maxLength={250}
                      placeholder=" Nouvelle actualité... "
                      onChangeText={(value) => setActus(value)}
                      value={actus}
                      style={homeStyles.inputActu}
                      multiline={true}
                      numberOfLines={4}
                    />
                    <View style={homeStyles.validationButtons}>
                      <TouchableOpacity
                        onPress={() => handleAddActu()}
                        style={homeStyles.button}
                        activeOpacity={0.8}
                      >
                        <Text style={homeStyles.addButton}> Ajouter </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleCloseActu()}
                        style={homeStyles.button}
                        activeOpacity={0.8}
                      >
                        <Text style={homeStyles.closedButton}> Fermer </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* UPLOAD MENU CANTINE*/}
              <TouchableOpacity
                onPress={() => uploadMenu()}
                style={homeStyles.button}
                activeOpacity={0.8}
              >
                 <Text style={homeStyles.addButton}>Ajouter un menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

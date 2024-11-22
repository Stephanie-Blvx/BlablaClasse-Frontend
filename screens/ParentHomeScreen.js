import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { globalStyles } from "../styles/globalStyles";
import { buttonStyles } from "../styles/buttonStyles";
import { homeStyles } from "../styles/homeStyles";

const BACKEND_ADDRESS = "https://blabla-classe-backend.vercel.app";

//Lien pour dl menu
const fileUri = `${FileSystem.documentDirectory}menu.jpg`;

export default function ParentHomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastActu, setLastActu] = useState([]);
 
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
  // Transformer les événements en dates marquées
  const transformEventsToMarkedDates = (events) => {
    const dates = {};
    events.forEach((event) => {
      const date = new Date(event.date).toISOString().split("T")[0];

      // Création d'un dot pour la classe associée à l'événement
      const dot =
        event.classe && event.classe.color
          ? { color: event.classe.color }
          : { color: "blue" };

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
        console.log("------data-----", data);
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
          console.log("LAST ACTU", data.actu.content);
          const lastActuToShow = data.actu.content;
          setLastActu(lastActuToShow);
          console.log("LAST ACTU", data);
        } else {
          console.error(data.error);
        }
      });
  };

  // appeler fetchPosts dès le premier rendu de la page
  useEffect(() => {
    fetchActu();
  }, [lastActu]);

  
 ///----- Fonction pour DOWNLOAD le menu cantine------

 const downloadMenu = async () => {
  //utiiser await
  const response = await fetch(`${BACKEND_ADDRESS}/menus`);
  const data = await response.json();

  if (data.result) {
    console.log("DATA RESULT", data);
 
    console.log("LAST MENU", data.menu.url);
  } else {
    console.error(data.error);
  }
  // Demander la permission d'accéder à la galerie
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status === "granted") {
    console.log("WHAT", data.menu.url);

    // ---Télécharger le fichier dans la galerie---
    const result = await FileSystem.downloadAsync(data.menu.url, fileUri);
    console.log("RESULT", result);
    console.log("Fichier téléchargé avec succès :", result.uri);

    // Enregistrer le fichier dans la galerie
    const asset = await MediaLibrary.createAssetAsync(result.uri);
    Alert.alert(
      "Téléchargement terminé",
      `Le fichier a été enregistré dans la galerie : ${asset.uri}`
    );
  } else {
    Alert.alert(
      "Permission refusée",
      "Vous devez autoriser l'accès à la galerie pour enregistrer le fichier."
    );
  }
};
  


  ///JSX///

  return (
    <SafeAreaView style={globalStyles.safeArea}>
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
              style={{ width: '100%' }}
              firstDay={1}
              onDayPress={onDayPress}
              current={currentDate}
              markedDates={markedDates}
              markingType={"multi-dot"}
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
            {/* Télécharger le menu cantine > PARENT < */}
            <View style={buttonStyles.buttonDownload}>
              <TouchableOpacity
                onPress={() => downloadMenu()}
                style={buttonStyles.buttonDownloadPress}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.buttonDownloadText}>
                  {" "}
                  🍽️ Télécharger le menu de la cantine{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


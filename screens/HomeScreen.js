import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const BACK_URL = 'http://192.168.3.174:3000/events';

export default function HomeScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fonction pour transformer les événements en dates marquées
  const transformEventsToMarkedDates = (events) => {
    const dates = {};

    events.forEach(event => {
      const date = new Date(event.date).toISOString().split('T')[0];
      const dots = event.classes?.map(classe => ({ color: classe.color })) || [];

      if (!dates[date]) {
        dates[date] = { marked: true, dots: [], events: [] };
      }

      dates[date].dots.push(...dots);
      dates[date].events.push(event);
    });

    return dates;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(BACK_URL);
        const data = await response.json();
        const dates = transformEventsToMarkedDates(data.events);

        setMarkedDates(dates);
        console.log("Marked Dates:", dates); // Log des dates marquées
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };

    fetchEvents();
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const selectedDateEvents = markedDates[selectedDate]?.events || [];

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
                <Text>Classe : {event.classes.map(classe => classe.name).join(', ')}</Text>
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
    </View>
  );
}
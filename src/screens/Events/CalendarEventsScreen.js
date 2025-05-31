// src/screens/Events/CalendarEventsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For calendar navigation icons
import { Timestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig'; // Ajusta según tu ruta real
import { useNavigation } from '@react-navigation/native';

// Placeholder for an individual event card
const EventCard = ({ id, title, date, time, location, isPastEvent = false, onPress }) => (
  <TouchableOpacity onPress={() => onPress(id)} style={styles.eventCard}>
    <View style={styles.eventImagePlaceholder} />
    <View style={styles.eventDetails}>
      <Text style={styles.eventDate}>{date}</Text>
      <Text style={styles.eventTitle}>{title}</Text>
      <View style={styles.eventInfoRow}>
        <Ionicons name="time-outline" size={14} color="#666" style={styles.eventInfoIcon} />
        <Text style={styles.eventInfoText}>{time}</Text>
      </View>
      <View style={styles.eventInfoRow}>
        <Ionicons name="location-outline" size={14} color="#666" style={styles.eventInfoIcon} />
        <Text style={styles.eventInfoText}>{location}</Text>
      </View>
    </View>
  </TouchableOpacity>
);


export default function CalendarEventsScreen() {
  // State for calendar month (simplified for placeholder)
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, c => c.toUpperCase());

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);

    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 12);

    if (newDate >= minDate) {
      setSelectedDate(newDate);
    } else {
      console.warn('No se puede navegar más allá de hace 12 meses');
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    if (newDate <= maxDate) {
      setSelectedDate(newDate);
    } else {
      console.warn('No se puede navegar más allá de 6 meses en el futuro');
    }
  };
  const navigation = useNavigation();
  const handleSelectEvent = (id) => {
    navigation.navigate('VerEvento', { id });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventosRef = collection(db, 'eventos');
        const querySnapshot = await getDocs(eventosRef);

        const now = new Date();
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const futurosDelMes = [];
        const pasadosDelMes = [];
        const pasadosAnteriores = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const eventDate = data.fecha?.toDate?.() || new Date();

          const event = {
            id: doc.id,
            title: data.titulo,
            description: data.descripcion,
            location: data.ubicacion,
            date: eventDate.toLocaleDateString(),
            time: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullDate: eventDate
          };

          const sameMonth =
            eventDate.getMonth() === selectedMonth &&
            eventDate.getFullYear() === selectedYear;

          if (sameMonth && eventDate >= now) {
            futurosDelMes.push(event);
          } else if (sameMonth && eventDate < now) {
            pasadosDelMes.push(event);
          } else if (eventDate < now && eventDate >= threeMonthsAgo) {
            pasadosAnteriores.push(event);
          }
        });

        setUpcomingEvents(futurosDelMes);
        setPastEvents([...pasadosDelMes, ...pasadosAnteriores]);
      } catch (error) {
        console.error('Error cargando eventos:', error);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Eventos</Text>

          {/* Calendar Section */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.calendarMonth}>{currentMonth}</Text>

              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {/* Day headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.calendarDayHeader}>{day}</Text>
              ))}
              {/* Placeholder for calendar days (example from image) */}
              {[...Array(5)].map((_, i) => <Text key={`empty-${i}`} style={styles.calendarDayText}> </Text>)} {/* Leading empty days */}
              {[26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 31, 1, 2, 3, 4, 5, 6].map((day, index) => (
                <View key={index} style={[styles.calendarDayWrapper, day === 3 && styles.selectedDay]}>
                  <Text style={[styles.calendarDayText, day === 3 && styles.selectedDayText]}>{day <= 6 ? day : ''}</Text> {/* Simple logic for 1-6 in next month */}
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.sectionHeading}>Próximos Eventos de {currentMonth}</Text>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                onPress={handleSelectEvent}
              />
            ))
          ) : (
            <Text style={styles.noEventsText}>No hay eventos próximos este mes.</Text>
          )}

          <Text style={styles.sectionHeading}>Eventos Pasados</Text>
          {pastEvents.length > 0 ? (
            pastEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                onPress={handleSelectEvent}
              />
            ))
          ) : (
            <Text style={styles.noEventsText}>No hay eventos pasados registrados.</Text>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 450, // Max width for content consistency
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
  },

  // Calendar Styles
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Helps center the days if not perfectly aligned
  },
  calendarDayHeader: {
    width: '14.28%', // 100% / 7 days
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  calendarDayWrapper: {
    width: '14.28%',
    aspectRatio: 1, // Keep it square
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue', // For debugging layout
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#1877F2', // Blue for selected day (e.g., Dec 3)
    borderRadius: 999, // Makes it a circle
  },
  selectedDayText: {
    color: '#fff',
  },

  // Event List Styles
  sectionHeading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10, // Slightly rounded corners
    backgroundColor: '#E0E0E0',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    flex: 1,
  },
  eventDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventInfoIcon: {
    marginRight: 5,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
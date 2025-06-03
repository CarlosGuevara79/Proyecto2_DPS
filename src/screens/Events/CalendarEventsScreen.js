// src/screens/Events/CalendarEventsScreen.js
import React, { useState, useEffect, useCallback } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';


const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); 
};


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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDay, setHighlightedDay] = useState(new Date().getDate()); 

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [eventsOnHighlightedDay, setEventsOnHighlightedDay] = useState([]); 

  const navigation = useNavigation();

  
  const currentMonthDisplay = selectedDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, c => c.toUpperCase());

  
  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);

    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 12); 

    if (newDate >= minDate) {
      setSelectedDate(newDate);
      setHighlightedDay(null);
    } else {
      console.warn('No se puede navegar más allá de hace 12 meses');
    }
  }, [selectedDate]);

  
  const handleNextMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6); 

    if (newDate <= maxDate) {
      setSelectedDate(newDate);
      setHighlightedDay(null); 
    } else {
      console.warn('No se puede navegar más allá de 6 meses en el futuro');
    }
  }, [selectedDate]);

  
  const handleSelectEvent = useCallback((id) => {
    navigation.navigate('VerEvento', { id });
  }, [navigation]);

  
  const getCalendarDays = useCallback(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const daysInCurrentMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const days = [];

    
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  }, [selectedDate]);

  
  const handleDayPress = useCallback((dayData) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    if (dayData.isCurrentMonth) {
      
      setHighlightedDay(dayData.day);
      
    } else {
      
      let newMonth = month;
      if (dayData.day > 15) { 
        newMonth = month - 1;
      } else { 
        newMonth = month + 1;
      }
      const newDate = new Date(year, newMonth, dayData.day);
      setSelectedDate(newDate); 
      setHighlightedDay(dayData.day); 
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchAndFilterEvents = async () => {
      try {
        const eventosRef = collection(db, 'eventos');
        const querySnapshot = await getDocs(eventosRef);

        const allEvents = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const eventDate = data.fecha?.toDate?.() || new Date();

          const event = {
            id: doc.id,
            title: data.titulo,
            description: data.descripcion,
            location: data.ubicacion,
            date: eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            fullDate: eventDate,
          };
          allEvents.push(event);
        });

        const now = new Date();
        const currentMonthYear = { month: selectedDate.getMonth(), year: selectedDate.getFullYear() };

        
        const upcomingInCurrentMonth = allEvents.filter(event =>
          event.fullDate.getMonth() === currentMonthYear.month &&
          event.fullDate.getFullYear() === currentMonthYear.year &&
          event.fullDate >= now
        ).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime()); 

        setUpcomingEvents(upcomingInCurrentMonth);

        // Filtra 3 meses para "Eventos Pasados")
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const allPastEvents = allEvents.filter(event =>
          event.fullDate < now && event.fullDate >= threeMonthsAgo
        ).sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());

        setPastEvents(allPastEvents);

        
        if (highlightedDay) {
          const eventsOnSpecificDay = allEvents.filter(event =>
            event.fullDate.getDate() === highlightedDay &&
            event.fullDate.getMonth() === currentMonthYear.month &&
            event.fullDate.getFullYear() === currentMonthYear.year
          ).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

          setEventsOnHighlightedDay(eventsOnSpecificDay);
        } else {
          setEventsOnHighlightedDay([]);
        }

      } catch (error) {
        console.error('Error cargando eventos:', error);
      }
    };

    fetchAndFilterEvents();
  }, [selectedDate, highlightedDay]);

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

              <Text style={styles.calendarMonth}>{currentMonthDisplay}</Text>

              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {/* Day headers */}
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                <Text key={`header-${index}`} style={styles.calendarDayHeader}>{day}</Text>
              ))}
              
              {getCalendarDays().map((cell, index) => {
                const isSelected = cell.isCurrentMonth && cell.day === highlightedDay;
                const isToday = cell.isCurrentMonth && cell.day === new Date().getDate() &&
                                selectedDate.getMonth() === new Date().getMonth() &&
                                selectedDate.getFullYear() === new Date().getFullYear();

                return (
                  <TouchableOpacity
                    key={`day-${index}`}
                    style={[
                      styles.calendarDayWrapper,
                      isSelected && styles.selectedDay,
                      !cell.isCurrentMonth && styles.otherMonthDayWrapper,
                      isToday && styles.todayHighlight,
                    ]}
                    onPress={() => handleDayPress(cell)}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        isSelected && styles.selectedDayText,
                        !cell.isCurrentMonth && styles.otherMonthDayText,
                        isToday && styles.todayText,
                      ]}
                    >
                      {cell.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Eventos del dia seleccionado */}
          {highlightedDay && eventsOnHighlightedDay.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Eventos del {highlightedDay} de {currentMonthDisplay}</Text>
              {eventsOnHighlightedDay.map(event => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  onPress={handleSelectEvent}
                />
              ))}
            </>
          )}
          {highlightedDay && eventsOnHighlightedDay.length === 0 && (
            <Text style={styles.noEventsText}>No hay eventos para el {highlightedDay} de {currentMonthDisplay}.</Text>
          )}

          {/* Próximos Eventos del mes */}
          <Text style={styles.sectionHeading}>Próximos Eventos de {currentMonthDisplay}</Text>
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

          {/* Eventos Pasados */}
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
                isPastEvent={true}
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
    maxWidth: 450,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
  },

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
    justifyContent: 'center',
  },
  calendarDayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  calendarDayWrapper: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  otherMonthDayWrapper: {
  },

  otherMonthDayText: {
    color: '#bbb',
  },
  selectedDay: {
    backgroundColor: '#1877F2',
    borderRadius: 999, 
  },
  selectedDayText: {
    color: '#fff',
  },
  todayHighlight: {
    borderColor: '#1877F2',
    borderWidth: 1,
    borderRadius: 999,
  },
  todayText: {
    fontWeight: 'bold',
  },

 
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
    borderRadius: 10,
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
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuthContext } from '../../hooks/useAuthContext';
import StarRating from '../../components/StarRating';
import InputField from '../../components/InputField';
import ButtonCustom from '../../components/ButtonCustom';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../../services/roles';
import { Ionicons } from '@expo/vector-icons';
import AsistenciaSelector from '../../components/AsistenciaSelector';

export default function EventDetailScreen({ route, navigation }) {
  const { id } = route.params; // ID del evento desde navegación
  const { user, role } = useAuthContext();

  const [evento, setEvento] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [yaAsistio, setYaAsistio] = useState(false);
  const [yaCalifico, setYaCalifico] = useState(false);

  useEffect(() => {
    cargarEvento();
    cargarComentarios();
    verificarAsistencia();
    verificarCalificacion();
    calcularPromedioCalificacion();
  }, []);

  const cargarEvento = async () => {
    const snap = await getDoc(doc(db, 'eventos', id));
    if (snap.exists()) {
      setEvento({ id: snap.id, ...snap.data(), fechaObj: snap.data().fecha.toDate() });
    } else {
      Alert.alert('Error', 'Evento no encontrado');
    }
  };

  const cargarComentarios = async () => {
    const comentariosRef = collection(db, 'eventos', id, 'comentarios');
    const snap = await getDocs(comentariosRef);
    const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComentarios(lista);
  };

  const [promedioCalificacion, setPromedioCalificacion] = useState(0);

  const calcularPromedioCalificacion = async () => {
    const calRef = collection(db, 'eventos', id, 'calificaciones');
    const snap = await getDocs(calRef);
    const total = snap.size;

    if (total === 0) return;

    let suma = 0;
    snap.forEach(doc => {
      suma += doc.data().estrellas || 0;
    });

    setPromedioCalificacion((suma / total).toFixed(1));
  };



  const verificarAsistencia = async () => {
    const asistenciaRef = doc(db, 'eventos', id, 'asistentes', user.uid);
    const snap = await getDoc(asistenciaRef);
    if (snap.exists() && snap.data().asistencia === 'si') {
      setYaAsistio(true);
    }
  };

  const actualizarAsistencia = async (valor) => {
    try {
      const ref = doc(db, 'eventos', id, 'asistentes', user.uid);
      await setDoc(ref, { asistencia: valor }, { merge: true });
      setYaAsistio(valor === 'si');
    } catch (error) {
      console.error('Error actualizando asistencia:', error);
    }
  };


  const verificarCalificacion = async () => {
    const calRef = doc(db, 'eventos', id, 'calificaciones', user.uid);
    const snap = await getDoc(calRef);
    if (snap.exists()) {
      setCalificacion(snap.data().estrellas);
      setYaCalifico(true);
    }
  };

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    await addDoc(collection(db, 'eventos', id, 'comentarios'), {
      userId: user.uid,
      nombre: user.name || 'Anónimo',
      mensaje: nuevoComentario,
      fecha: new Date()
    });

    setNuevoComentario('');
    cargarComentarios();
  };

  const enviarCalificacion = async (valor) => {
    try {
      await setDoc(
        doc(db, 'eventos', id, 'calificaciones', user.uid), // usa UID como ID
        {
          userId: user.uid,
          estrellas: valor
        },
        { merge: true } // para no sobrescribir todo el documento si ya existe
      );

      setCalificacion(valor);
      setYaCalifico(true);
    } catch (error) {
      console.error('Error guardando calificación:', error);
    }
  };

  if (!evento) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{evento.titulo}</Text>
        <Text style={styles.subtitle}>
          {evento.fechaObj.toLocaleDateString()} - {evento.fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.subtitle}>{evento.ubicacion}</Text>
        {new Date() < evento.fechaObj && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Asistirás a este evento?</Text>
            <AsistenciaSelector
              asistencia={yaAsistio ? 'si' : 'no'}
              onSelect={actualizarAsistencia}
              eventoFinalizado={new Date() > evento.fechaObj}
            />
          </View>
        )}
      </View>

      {(role === ROLE_ADMIN || role === ROLE_ORGANIZADOR) && (
        <ButtonCustom
          title="Editar Evento"
          onPress={() => navigation.navigate('EditarEvento', { id: evento.id })}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción del evento</Text>
        <Text style={styles.text}>{evento.descripcion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios</Text>
        {comentarios.length > 0 ? (
          comentarios.map(com => (
            <View key={com.id} style={styles.comentario}>
              <Text style={styles.comAutor}>{com.nombre}</Text>
              <Text>{com.mensaje}</Text>
            </View>
          ))
        ) : (
          <Text>No hay comentarios aún.</Text>
        )}

        {new Date() > evento.fechaObj ? (
          <>
            <InputField
              label="Nuevo comentario"
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
            />
            <ButtonCustom title="Comentar" onPress={enviarComentario} />
          </>
        ) : (
          <Text style={{ color: '#666', marginTop: 10 }}>Solo podrás comentar después del evento.</Text>
        )}
      </View>

      {yaAsistio && new Date() > evento.fechaObj && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu calificación</Text>
          <StarRating
            rating={calificacion}
            onRatingChange={enviarCalificacion}
            disabled={yaCalifico}
          />
          {yaCalifico && (
            <Text style={styles.sectionTitle}>Gracias por tu calificación</Text>
          )}
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={styles.sectionTitle}>Calificación promedio:</Text>
        <Text style={{ fontSize: 16, color: '#555' }}>
          {promedioCalificacion} ★
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  assistButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  assistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },

  assistText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },

  assistSelectedYes: {
    backgroundColor: '#4CAF50',
  },

  assistSelectedNo: {
    backgroundColor: '#F44336',
  },

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

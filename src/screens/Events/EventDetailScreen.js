import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image // Aqui se importa la imagen que iria como postada del evento
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
  const [promedioCalificacion, setPromedioCalificacion] = useState(0);


  useEffect(() => {
    cargarEvento();
    cargarComentarios();
    verificarAsistencia();
    verificarCalificacion();
    calcularPromedioCalificacion();

    // Setting header options
    navigation.setOptions({
      headerShown: true,
      title: 'Detalles del evento',
      headerLeft: () => (
        // This is your custom headerLeft. We can put the 'Return' functionality here.
        // For now, it's 'null', let's keep it that way for clarity in this specific problem.
        // The main 'Return' button is at the bottom of the ScrollView.
        null
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ marginRight: 10 }}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, id]); // Added 'id' to dependency array for clarity

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

      <Text style={styles.eventTitleMain}>{evento.titulo}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={20} color="#666" />
        <Text style={styles.infoText}>
          {evento.fechaObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#666" />
        <Text style={styles.infoText}>
          {evento.fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </Text>
      </View>

      <TouchableOpacity style={styles.addToCalendarButton}>
        <Ionicons name="calendar-sharp" size={18} color="#1877F2" />
        <Text style={styles.addToCalendarButtonText}>Add to Calendar</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>Address</Text>
        </View>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="location" size={50} color="red" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hosted By</Text>
        <Text style={styles.text}>Host Name</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Description</Text>
        <Text style={styles.text}>{evento.descripcion}</Text>
      </View>

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

      {(role === ROLE_ADMIN || role === ROLE_ORGANIZADOR) && (
        <ButtonCustom
          title="Editar Evento"
          onPress={() => navigation.navigate('EditarEvento', { id: evento.id })}
        />
      )}


      {new Date() > evento.fechaObj && (
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

          <InputField
            label="Nuevo comentario"
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
          />
          <ButtonCustom title="Comentar" onPress={enviarComentario} />
        </View>
      )}


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


      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
        <Text style={styles.sectionTitle}>Calificación promedio:</Text>
        <Text style={{ fontSize: 16, color: '#555' }}>
          {promedioCalificacion} ★
        </Text>
      </View>

      {/* Fix for Unexpected text node: <br> is HTML, not JSX for React Native */}
      {/* Replace <br> with empty View components with height for spacing */}
      <View style={{ height: 10 }} />
      <View style={{ height: 10 }} />
      <View style={{ height: 10 }} />


      
      <TouchableOpacity
        onPress={() => navigation.navigate('Eventos')} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Regresar al calendario</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventTitleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  addToCalendarButtonText: {
    color: '#1877F2',
    marginLeft: 5,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  comentario: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  comAutor: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});
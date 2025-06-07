// src/screens/MessagesScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para los iconos (asegúrate de tenerlo instalado: expo install @expo/vector-icons)

export default function MessagesScreen() {
  // Datos simulados para los chats
  const chatData = [
    { id: '1', name: 'Haley James', lastMessage: 'Stand up for what you believe in', unread: 9 },
    { id: '2', name: 'Nathan Scott', lastMessage: 'One day you’re seventeen and planning for someday.', unread: 0 },
    { id: '3', name: 'Brooke Davis', lastMessage: 'I am who I am. No excuses.', unread: 2 },
    { id: '4', name: 'Jamie Scott', lastMessage: 'Some people are a little different. I think that’s cool.', unread: 0 },
    { id: '5', name: 'Marvin McFadden', lastMessage: 'Last night in the NBA the Charlotte Bobcats quietly made a move that most sports fans...', unread: 0 },
    { id: '6', name: 'Antwon Taylor', lastMessage: 'Meet me at the Rivercourt', unread: 0 },
    { id: '7', name: 'Jake Jagielski', lastMessage: 'In your life, you’re gonna go to some great places, and do some wonderful things.', unread: 0 },
    { id: '8', name: 'Peyton Sawyer', lastMessage: 'Every song ends. Is that any reason not to enjoy the music?', unread: 0 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="create-outline" size={24} color="#007AFF" /> {/* Icono de nuevo mensaje */}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8e8e93"
        />
      </View>

      <ScrollView style={styles.chatList}>
        {chatData.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle-outline" size={50} color="#ccc" />
            </View>
            <View style={styles.chatContent}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
            </View>
            {chat.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{chat.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, // Línea fina en la parte inferior
    borderBottomColor: '#ccc',
  },
  headerButton: {
    padding: 5,
  },
  headerButtonText: {
    color: '#007AFF', // Azul estándar de iOS para botones de acción
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF4', // Fondo gris claro para la barra de búsqueda
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 17,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0', // Gris claro para el círculo del avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  lastMessage: {
    fontSize: 15,
    color: '#8e8e93', // Color gris para el último mensaje
  },
  unreadBadge: {
    backgroundColor: '#007AFF', // Azul para la burbuja de no leídos
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/
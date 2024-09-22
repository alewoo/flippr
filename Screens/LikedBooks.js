import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, Text, SafeAreaView, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import IP from "./IP";

const { width, height } = Dimensions.get('window');

const LikedBooks = ({ route, navigation }) => { 
  const { token } = route.params;   
  const [likedBooks, setLikedBooks] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const fetchLikedBooks = async () => {
    try {
      const res = await axios.get('http://' + new IP().myIP + '/api/books/like', {
        headers: { 'x-auth-token': token }, 
      });
      setLikedBooks(res.data.likedBooks);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load liked books');
    }
  };

  const handleAccountSettings = () => {
    Alert.alert('Navigating to Account Settings');
    setShowMenu(false);
  };

  const handleLogout = () => {
    navigation.navigate('LandingPage');  
    setShowMenu(false);
  };

  useEffect(() => {
    fetchLikedBooks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>flippr</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Image source={require('../assets/images/profile_icon.png')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {likedBooks.map((bookURL, index) => (
          <View key={index} style={styles.bookContainer}>
            <Image source={{ uri: bookURL }} style={styles.bookCover} />
          </View>
        ))}
      </ScrollView>

      {/* Task Bar */}
      <View style={styles.taskBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { token })}>
          <Image source={require('../assets/images/home_icon_black.png')} style={styles.taskIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/images/save_icon_pink.png')} style={styles.taskIcon} />
        </TouchableOpacity>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.menuItem} onPress={handleAccountSettings}>
                <Text style={styles.menuItemText}>Account Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuItemText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#E7EAF2',
  },
  scrollView: {
    marginTop: 70
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'ProximaNova-Bold',
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  profileIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  taskBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255)', // Semi-transparent white background
  },
  taskIcon: {
    width: 30,
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent background to catch touches
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 18,
    fontFamily: 'ProximaNova-bold',
    textAlign: 'center',
  },
  bookContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  bookCover: {
    width: 300,
    height: 400,
  },
};

export default LikedBooks;
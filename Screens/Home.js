import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, Alert, SafeAreaView, Dimensions, PanResponder, Animated, TouchableOpacity, ImageBackground, Modal, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import Loading from "./Loading"
import IP from './IP';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 90; // Distance to trigger like/dislike

const Home = ({ route, navigation }) => {
  const { token } = route.params;

  const [book, setBook] = useState(null);
  const [bookArr, setBookArr] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const fetchInitialBooks = async (interests = 'the') => {
    try {
      const res = await axios.get(`https://openlibrary.org/search.json?q=${interests}`);
      setBookArr(res.data.docs)  
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRandomBook = async () => {
    const randomBook = bookArr[Math.floor(Math.random() * bookArr.length)];
    const coverURL = `https://covers.openlibrary.org/b/id/${randomBook.cover_i}-L.jpg`;
    setBook({ ...randomBook, coverURL });
  }

  useEffect(() => {
    fetchInitialBooks(); 
  }, []);

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = async () => {
    try {
      console.log(token)
      await axios.post('http://' + new IP().myIP + '/api/books/like', {
        token: token,
        book: book.coverURL,   
      });
      fetchRandomBook(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = () => {
    fetchRandomBook();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          handleLike();
          resetPosition();
        });
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: -width, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          handleDislike();
          resetPosition();
        });
      } else {
        resetPosition();
      }
    },
  });

  const handleLogout = () => {
    navigation.navigate('LandingPage');  
    setShowMenu(false);
  };

  const handleAccountSettings = () => {
    Alert.alert('Navigating to Account Settings');
    setShowMenu(false);
  };

  if (!bookArr) return <Loading/>;
  else if (!book) {
    fetchRandomBook();
    return <Loading/>;
  }
  return (
    <ImageBackground
      source={{ uri: book.coverURL }}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>flippr</Text>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Image source={require('../assets/images/profile_icon.png')} style={styles.profileIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View
            style={{
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
          <TouchableOpacity onPress={() => navigation.navigate('BookInfo', { 
              title: book.title, 
              author: book.author, 
              image_url: book.coverURL 
            })}>
              {book.coverURL ? (
                <Image
                  source={{ uri: book.coverURL }}
                  style={styles.bookCover}
                  resizeMode="stretch"
                />
              ) : (
                <View style={styles.noCoverContainer}>
                  <Text>No cover available</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Task Bar */}
        <View style={styles.taskBar}>
          <TouchableOpacity>
            <Image source={require('../assets/images/home_icon_pink.png')} style={styles.taskIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LikedBooks', { token })}>
            <Image source={require('../assets/images/saved_icon_black.png')} style={styles.taskIcon} />
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
    </ImageBackground>
  );
};

const styles = {
    backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.5)', // Add a semi-transparent white overlay
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  bookCover: {
    width: width, // Slightly smaller to show background
    height: height * 0.73,
    marginBottom: 20,
    borderRadius: 10, // Add rounded corners
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  noCoverContainer: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  taskBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Semi-transparent white background
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
};

export default Home;

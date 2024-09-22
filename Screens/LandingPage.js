import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  

const LandingPage = () => {
  //animation and routing
  const bounceValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();  

  //animation effect
  useEffect(() => {
    Animated.spring(bounceValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  //logo and signup/login button that user sees when they open app
  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[styles.title, { transform: [{ scale: bounceValue }] }]}
      >
        flippr.
      </Animated.Text>

      <TouchableOpacity 
        style={styles.signUpButton} 
        onPress={() => navigation.navigate('Signup')}  
      >
        <Text style={styles.buttonText}>sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}  
      >
        <Text style={styles.loginText}>log in</Text>
      </TouchableOpacity>
    </View>
  );
};

//styles for logo/signup/login features
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7EAF2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'ProximaNova-Bold',
    color: '#000',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',  
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4,  
  },
  signUpButton: {
    backgroundColor: '#C76D7E',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'ProximaNova-Bold',
    color: '#fff',
  },
  loginText: {
    fontSize: 18,
    fontFamily: 'ProximaNova-Bold',
    color: '#000',
  },
});

export default LandingPage;

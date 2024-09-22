import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const Loading = () => { 
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/book_flip_3.gif')} // Adjust the path as needed
        style={styles.gif} 
        resizeMode="contain" 
      />
      <Text style={styles.text}>flipping the pages of {"\n"} your next great read</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // Align items center
    backgroundColor: "#C76D7E"
  },
  gif: {
    width: 200, // Adjust width as needed
    height: 300, // Adjust height as needed
  },
  text: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: 22,
    color: '#000',
  },
});

export default Loading;
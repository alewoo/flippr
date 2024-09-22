import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { ScrollView, Image, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import IP from "./IP"
import axios from 'axios';

const BookInfo = ({ route, navigation }) => {
    const {title, author, image_url} = route.params
    
    const [bookOverview, setBookOverview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState('');

    const getSummary = async () => {    
        try {
          const response = await axios.post('http://' + new IP().myIP + '/api/ai/summary', {
            title: title,
          });
          setSummary(response.data.summary);
          setLoading(false)
        } catch (error) {
          console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getSummary()
    }, [title]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Image
                source={require("../assets/images/back-icon.png")}
                style={styles.backIcon}
                />
            </TouchableOpacity>

            {/* Top Row with Image and Text */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: image_url }} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.author}>{author}</Text>
                </View>
            </View>

            {/* Bigger Paragraph Text Box */}
            <View style={styles.paragraphContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <Text style={styles.paragraph}>{summary}</Text>
                )}
            </View>

            {/* Buttons at the Bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>buy it</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>audiobook</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50
    },
    backButton: {
        position: "absolute",
        top: 0,
        right: 20,
        top: 10,
        zIndex: 10,
    },
    backIcon: {
    width: 24,
    height: 24,
    },    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 240,
        borderRadius: 5,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: "ProximaNova-Bold",
        fontWeight: 'bold',
    },
    author: {
        fontSize: 16,
        fontFamily: "ProximaNova-Regular",
        color: 'gray',
    },
    paragraphContainer: {
        minHeight: 100,
        justifyContent: 'center',
    },
    paragraph: {
        fontFamily: "ProximaNova-Regular",
        fontSize: 16,
        marginBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#C76D7E',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: "ProximaNova-Bold"
    },
});

export default BookInfo;
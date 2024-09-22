import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import IP from "./IP";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    console.log("handleSignUp function called"); // Debug log

    if (!username || !password) {
      Alert.alert("Error", "Please provide both username and password");
      return;
    }

    console.log("Attempting to sign up with:", username); // Debug log

    try {
      console.log("Making API call..."); // Debug log
      const res = await axios.post("http://" + new IP().myIP + "/api/auth/signup", {
        email: username,
        password: password,
      });

      console.log("API response:", JSON.stringify(res.data, null, 2)); // More detailed logging

      if (res.data.token) {
        navigation.navigate("InterestsQuestionnaire", {
          token: res.data.token,
        });
      } else {
        console.log("Sign-up successful but no token received");
        Alert.alert(
          "Partial Success",
          "Sign-up successful, but there was an issue with authentication. Please try logging in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login", { username }),
            },
          ]
        );
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.msg || "An error occurred during sign-up";
      Alert.alert("Error", errorMessage);
    }
  };

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

      <Text style={styles.title}>flippr.</Text>

      <TextInput
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7EAF2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 48,
    fontFamily: "ProximaNova-Bold",
    color: "#000",
    marginBottom: 60,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    marginBottom: 20,
    fontSize: 18,
    fontFamily: "ProximaNova-Regular",
    color: "#000",
    paddingLeft: 10,
  },
  signUpButton: {
    backgroundColor: "#C76D7E",
    padding: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "ProximaNova-Bold",
    color: "#fff",
  },
});

export default Signup;

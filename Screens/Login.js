import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import IP from './IP';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const navigation = useNavigation();

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 125,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 125,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 125,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 125,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://" + new IP().myIP + "/api/auth/login",
        {
          email: username,
          password: password,
        }
      );

      if (res.data.token) {
        console.log(res.data.token);
        navigation.navigate("Home", { token: res.data.token });
      }
    } catch (err) {
      setIsError(true);
      shake();
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

      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <TextInput
          placeholder="username"
          value={username}
          onChangeText={setUsername}
          style={[styles.input, isError && styles.inputError]}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, isError && styles.inputError]}
          placeholderTextColor="#888"
        />
      </Animated.View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>log in</Text>
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
    width: 300,
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
  inputError: {
    borderBottomColor: "#C76D7E",
    color: "#C76D7E",
  },
  loginButton: {
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

export default Login;

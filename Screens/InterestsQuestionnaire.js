import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const InterestsQuestionnaire = ({ route }) => {
  const { token } = route.params;
  const navigation = useNavigation();

  const [genres, setGenres] = useState([]);
  const [readingLevel, setReadingLevel] = useState("");
  const [settings, setSettings] = useState([]);
  const [bookLength, setBookLength] = useState([]);
  const [readingPurpose, setReadingPurpose] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const genreOptions = [
    "Healthcare",
    "Finance",
    "Tech",
    "Entrepreneurship",
    "Fiction",
    "Non-Fiction",
    "Sci-Fi",
    "Mystery",
    "Thriller",
    "Fantasy Fiction",
    "Biography",
    "Autobiography",
    "Horror",
    "Poetry",
    "Children's Books",
  ];
  const readingLevelOptions = ["Beginner", "Intermediate", "Pro"];
  const settingOptions = ["Utopia", "Dystopia", "Historical", "Modern-Day"];
  const bookLengthOptions = [
    "< 100 pages",
    "100 - 200 pages",
    "200 - 300 pages",
    "> 300 pages",
  ];
  const readingPurposeOptions = [
    "Thought-provoking",
    "Action-packed",
    "Educational",
    "Relaxing",
  ];

  useEffect(() => {
    const formIsValid =
      genres.length > 0 &&
      readingLevel !== "" &&
      settings.length > 0 &&
      bookLength.length > 0 &&
      readingPurpose.length > 0;

    setIsFormValid(formIsValid);
  }, [genres, readingLevel, settings, bookLength, readingPurpose]);

  const toggleSelection = (option, state, setState) => {
    if (state.includes(option)) {
      setState(state.filter((item) => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  const submitPreferences = async () => {
    try {
      // Make sure this URL is correct and the endpoint exists on your server
      /*await axios.post(
        "http://10.250.133.3:5000/api/user/preferences",
        {
          token,
          preferences: {
            genres,
            readingLevel,
            settings,
            bookLength,
            readingPurpose,
          },
        }
      );*/
      // If successful, navigate to Home
      navigation.navigate("Home", { token });
    } catch (error) {
      console.error("Preferences error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    }
  };

  const renderOptions = (options, state, setState, multiple = true) => {
    return options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          multiple
            ? state.includes(option) && styles.selectedOption
            : state === option && styles.selectedOption,
        ]}
        onPress={() =>
          multiple ? toggleSelection(option, state, setState) : setState(option)
        }
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preferences</Text>

      <Text style={styles.sectionTitle}>Genres (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(genreOptions, genres, setGenres)}
      </View>

      <Text style={styles.sectionTitle}>Level of Reading</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(
          readingLevelOptions,
          readingLevel,
          setReadingLevel,
          false
        )}
      </View>

      <Text style={styles.sectionTitle}>
        Preferred Setting and Style (Select multiple)
      </Text>
      <View style={styles.optionsContainer}>
        {renderOptions(settingOptions, settings, setSettings)}
      </View>

      <Text style={styles.sectionTitle}>
        Desired Book Length (Select multiple)
      </Text>
      <View style={styles.optionsContainer}>
        {renderOptions(bookLengthOptions, bookLength, setBookLength)}
      </View>

      <Text style={styles.sectionTitle}>Reading Purpose (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(
          readingPurposeOptions,
          readingPurpose,
          setReadingPurpose
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !isFormValid && styles.disabledButton]}
        onPress={submitPreferences}
        disabled={!isFormValid}
      >
        <Text style={styles.submitButtonText}>
          {isFormValid ? "Submit" : "Please answer all questions"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E7EAF2",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 30,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  option: {
    backgroundColor: "#C76D7E",
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: "#9B4B58",
  },
  optionText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#C76D7E",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
});

export default InterestsQuestionnaire;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Gym</Text>
        <Text style={styles.subtitle}>Your personal workout companion</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Routines")}
        >
          <Text style={styles.buttonText}>View Routines</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Workout History</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: 100,
  },
  title: {
    fontSize: 50,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Serena",
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    fontFamily: "Serena",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: "#1c1c1e",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "semibold",
    color: "#fff",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
});

export default HomeScreen;

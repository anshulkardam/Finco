import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Routine } from "../types";

type AddRoutineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddRoutine"
>;
type AddRoutineScreenRouteProp = RouteProp<RootStackParamList, "AddRoutine">;

type Props = {
  navigation: AddRoutineScreenNavigationProp;
  route: AddRoutineScreenRouteProp;
};

const AddRoutineScreen = ({ navigation, route }: Props) => {
  const [routineName, setRoutineName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [routineId, setRoutineId] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.routine) {
      const { routine } = route.params;
      setRoutineName(routine.name);
      setRoutineId(routine.id);
      setIsEditing(true);
    }
  }, [route.params?.routine]);

  const saveRoutine = async () => {
    if (routineName.trim() === "") {
      Alert.alert("Error", "Please enter a routine name.");
      return;
    }

    try {
      const existingRoutines = await AsyncStorage.getItem("routines");
      let routines = existingRoutines ? JSON.parse(existingRoutines) : [];

      if (isEditing && routineId) {
        routines = routines.map((routine: Routine) =>
          routine.id === routineId ? { ...routine, name: routineName } : routine
        );
      } else {
        const newRoutine = {
          id: Date.now().toString(),
          name: routineName,
          exercises: [],
        };
        routines.push(newRoutine);
      }

      await AsyncStorage.setItem("routines", JSON.stringify(routines));
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", `Failed to save routine. ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? "Edit Routine" : "New Routine"}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Routine Name"
        placeholderTextColor="#888"
        value={routineName}
        onChangeText={setRoutineName}
      />
      <TouchableOpacity style={styles.button} onPress={saveRoutine}>
        <Text style={styles.buttonText}>{isEditing ? "Update" : "Save"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#1c1c1e",
    color: "#fff",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AddRoutineScreen;

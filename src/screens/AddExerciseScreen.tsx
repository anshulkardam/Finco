
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Exercise } from '../types';

type AddExerciseScreenRouteProp = RouteProp<RootStackParamList, 'AddExercise'>;
type AddExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddExercise'>;

type Props = {
  route: AddExerciseScreenRouteProp;
  navigation: AddExerciseScreenNavigationProp;
};

const AddExerciseScreen = ({ route, navigation }: Props) => {
  const { routineId } = route.params;
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [exerciseId, setExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.exercise) {
      const { exercise } = route.params;
      setExerciseName(exercise.name);
      setSets(exercise.sets.toString());
      setReps(exercise.reps.toString());
      setWeight(exercise.weight);
      setYoutubeLink(exercise.youtubeLink);
      setExerciseId(exercise.id);
      setIsEditing(true);
    }
  }, [route.params?.exercise]);

  const saveExercise = async () => {
    if (exerciseName.trim() === '' || sets.trim() === '' || reps.trim() === '' || weight.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const existingRoutines = await AsyncStorage.getItem('routines');
      let routines = existingRoutines ? JSON.parse(existingRoutines) : [];
      const routineIndex = routines.findIndex((r: any) => r.id === routineId);

      if (routineIndex > -1) {
        if (isEditing && exerciseId) {
          const exerciseIndex = routines[routineIndex].exercises.findIndex((e: Exercise) => e.id === exerciseId);
          if (exerciseIndex > -1) {
            routines[routineIndex].exercises[exerciseIndex] = {
              ...routines[routineIndex].exercises[exerciseIndex],
              name: exerciseName,
              sets: parseInt(sets),
              reps: parseInt(reps),
              weight: weight,
              youtubeLink: youtubeLink,
            };
          }
        } else {
          const newExercise = {
            id: Date.now().toString(),
            name: exerciseName,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: weight,
            youtubeLink: youtubeLink,
          };
          routines[routineIndex].exercises.push(newExercise);
        }
        await AsyncStorage.setItem('routines', JSON.stringify(routines));
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Routine not found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to save exercise. ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? 'Edit Exercise' : 'New Exercise'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        placeholderTextColor="#888"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        placeholderTextColor="#888"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor="#888"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor="#888"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="YouTube Link (optional)"
        placeholderTextColor="#888"
        value={youtubeLink}
        onChangeText={setYoutubeLink}
      />
      <TouchableOpacity style={styles.button} onPress={saveExercise}>
        <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddExerciseScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Routine, Exercise } from '../types';

type RoutineDetailScreenRouteProp = RouteProp<RootStackParamList, 'RoutineDetail'>;
type RoutineDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoutineDetail'>;

type Props = {
  route: RoutineDetailScreenRouteProp;
  navigation: RoutineDetailScreenNavigationProp;
};

const RoutineDetailScreen = ({ route, navigation }: Props) => {
  const { routineId, routineName } = route.params;
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const isFocused = useIsFocused();

  const fetchRoutine = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem('routines');
      if (storedRoutines) {
        const routines = JSON.parse(storedRoutines);
        const currentRoutine = routines.find((r: any) => r.id === routineId);
        if (currentRoutine) {
          setRoutine(currentRoutine);
        }
      }
    } catch (error) {
      console.error("Failed to fetch routine", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchRoutine();
    }
  }, [isFocused]);

  const handleDeleteExercise = () => {
    if (!selectedExercise) return;

    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel", onPress: () => setModalVisible(false) },
        {
          text: "OK",
          onPress: async () => {
            try {
              const storedRoutines = await AsyncStorage.getItem('routines');
              if (storedRoutines) {
                let routines = JSON.parse(storedRoutines);
                const routineIndex = routines.findIndex((r: any) => r.id === routineId);
                if (routineIndex > -1) {
                  routines[routineIndex].exercises = routines[routineIndex].exercises.filter((e: Exercise) => e.id !== selectedExercise.id);
                  await AsyncStorage.setItem('routines', JSON.stringify(routines));
                  fetchRoutine();
                  setModalVisible(false);
                }
              }
            } catch (error) {
              console.error("Failed to delete exercise", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const openMenu = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTouchable}
        onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id, exerciseName: item.name, routineId: routineId })}
      >
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemSubText}>{item.sets} sets x {item.reps} reps</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionsButton} onPress={() => openMenu(item)}>
        <Text style={styles.optionsText}>•••</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{routineName}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExercise', { routineId })}
        >
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={routine?.exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        // ListHeaderComponent={
        //   <TouchableOpacity
        //     style={styles.startButton}
        //     onPress={() => routine && navigation.navigate('Workout', { routine })}
        //   >
        //     <Text style={styles.startButtonText}>Start Workout</Text>
        //   </TouchableOpacity>
        // }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddExercise', { routineId: routineId, exercise: selectedExercise! });
              }}
            >
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeleteExercise}
            >
              <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        fontFamily: 'Serena',
        color: '#ee5d5dff',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#63a3e7ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
    },
    list: {
        width: '100%',
    },
    startButton: {
        backgroundColor: '#1c1c1e',
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    startButtonText: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemContainer: {
        backgroundColor: '#1c1c1e',
        padding: 14,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTouchable: {
        flex: 1,
    },
    itemText: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
    },
    itemSubText: {
        fontSize: 16,
        color: '#888',
        marginTop: 0,
    },
    optionsButton: {
        padding: 10,
    },
    optionsText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1c1c1e',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    deleteButtonText: {
        color: 'red',
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#2c2c2e',
    },
});

export default RoutineDetailScreen;

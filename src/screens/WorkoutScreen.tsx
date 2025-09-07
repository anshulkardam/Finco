import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Exercise, Routine } from '../types';

type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'Workout'>;
type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;

type Props = {
  route: WorkoutScreenRouteProp;
  navigation: WorkoutScreenNavigationProp;
};

const WorkoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { routine } = route.params;
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, timer]);

  const handleFinishWorkout = () => {
    setIsActive(false);
    // Here you would typically save the workout to storage
    console.log('Workout finished:', {
      routine: routine,
      duration: timer,
      date: new Date(),
    });
    navigation.navigate('Home');
  };

  const handleCancelWorkout = () => {
    setIsActive(false);
    navigation.goBack();
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text>{item.sets} sets x {item.reps} reps @ {item.weight} kg</Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Finish Workout" onPress={handleFinishWorkout} />
        <Button title="Cancel Workout" onPress={handleCancelWorkout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default WorkoutScreen;

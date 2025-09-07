
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RoutinesScreen from '../screens/RoutinesScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import AddRoutineScreen from '../screens/AddRoutineScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import { Routine, Exercise } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Routines: undefined;
  RoutineDetail: { routineId: string, routineName: string };
  ExerciseDetail: { exerciseId: string, exerciseName: string, routineId: string };
  AddRoutine: { routine?: Routine };
  AddExercise: { routineId: string, exercise?: Exercise };
  Workout: { routine: Routine };
  WorkoutHistory: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Routines" component={RoutinesScreen} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="AddRoutine" component={AddRoutineScreen} />
      <Stack.Screen name="AddExercise" component={AddExerciseScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

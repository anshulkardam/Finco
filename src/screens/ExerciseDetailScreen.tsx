import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import YoutubePlayer from "react-native-youtube-iframe";

type ExerciseDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ExerciseDetail"
>;

type Props = {
  route: ExerciseDetailScreenRouteProp;
};

type ExerciseDetails = {
  sets: number;
  reps: number;
  weight: string;
  youtubeLink?: string;
};

const ExerciseDetailScreen = ({ route }: Props) => {
  const { exerciseId, exerciseName, routineId } = route.params;
  const [details, setDetails] = useState<ExerciseDetails | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem("routines");
        if (storedRoutines) {
          const routines = JSON.parse(storedRoutines);
          const currentRoutine = routines.find((r: any) => r.id === routineId);
          if (currentRoutine) {
            const currentExercise = currentRoutine.exercises.find(
              (e: any) => e.id === exerciseId
            );
            if (currentExercise) {
              setDetails(currentExercise);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch exercise details", error);
      }
    };

    if (isFocused) {
      fetchExerciseDetails();
    }
  }, [routineId, exerciseId, isFocused]);

  const getYoutubeVideoId = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  if (!details) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const videoId = getYoutubeVideoId(details.youtubeLink || "");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exerciseName}</Text>
      </View>
      {videoId ? (
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={220}
            play={false}
            videoId={videoId}
            onError={(e: any) => Alert.alert("Error", "Failed to load video.")}
          />
        </View>
      ) : null}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sets</Text>
          <Text style={styles.detailValue}>{details.sets}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reps</Text>
          <Text style={styles.detailValue}>{details.reps}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{details.weight}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontFamily: "Serena",
    color: "#fff",
    textAlign: "center",
  },
  videoContainer: {
    marginHorizontal: 16,
    marginBottom: 0,
    borderRadius: 15,
    overflow: "hidden",
  },
  detailsContainer: {
    marginHorizontal: 6,
    padding: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 6,
  },
  detailLabel: {
    fontSize: 22,
    fontFamily: "Roboto_400Regular",
    color: "#888",
  },
  detailValue: {
    fontSize: 24,
    fontFamily: "Roboto_700Bold",
    color: "#fff",
  },
});

export default ExerciseDetailScreen;

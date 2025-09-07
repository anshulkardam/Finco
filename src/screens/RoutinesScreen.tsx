
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useIsFocused } from '@react-navigation/native';
import { Routine } from '../types';

type RoutinesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Routines'>;

type Props = {
  navigation: RoutinesScreenNavigationProp;
};

const RoutinesScreen = ({ navigation }: Props) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const isFocused = useIsFocused();

  const fetchRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem('routines');
      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      }
    } catch (error) {
      console.error("Failed to fetch routines", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchRoutines();
    }
  }, [isFocused]);

  const handleDeleteRoutine = () => {
    if (!selectedRoutine) return;

    Alert.alert(
      "Delete Routine",
      "Are you sure you want to delete this routine?",
      [
        { text: "Cancel", style: "cancel", onPress: () => setModalVisible(false) },
        {
          text: "OK",
          onPress: async () => {
            try {
              const updatedRoutines = routines.filter(routine => routine.id !== selectedRoutine.id);
              await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
              setRoutines(updatedRoutines);
              setModalVisible(false);
            } catch (error) {
              console.error("Failed to delete routine", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const openMenu = (routine: Routine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Routine }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTouchable}
        onPress={() => navigation.navigate('RoutineDetail', { routineId: item.id, routineName: item.name })}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionsButton} onPress={() => openMenu(item)}>
        <Text style={styles.optionsText}>•••</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Routines</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRoutine', {})}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={routines}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
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
                navigation.navigate('AddRoutine', { routine: selectedRoutine! });
              }}
            >
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeleteRoutine}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontFamily: "Serena",
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        backgroundColor: '#1c1c1e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTouchable: {
        flex: 1,
    },
    itemText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: "Roboto_400Regular",
        color: '#fff',
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
        fontFamily:"Roboto_700Bold",
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

export default RoutinesScreen;

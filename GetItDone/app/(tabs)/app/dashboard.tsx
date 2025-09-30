// GetItDone/src/screens/TaskListScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert, // Imported for the pop-up deletion confirmation
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

// Define the shape of a Task object
interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');

  // --- Task Management Functions ---

  // Function to add a new task to the list
  const handleAddTask = () => {
    if (newTaskText.trim().length > 0) {
      const newTask: Task = {
        id: Math.random().toString(),
        text: newTaskText.trim(),
        isCompleted: false,
      };
      setTasks(currentTasks => [...currentTasks, newTask]);
      setNewTaskText('');
    }
  };

  // Function to delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
  };

  // Function to toggle the completion status of a task
  const handleToggleTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // Function to prompt the user before deleting a task
  const handleLongPress = (task: Task) => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.text}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleDeleteTask(task.id),
          style: "destructive" // Makes the button red/stand out
        }
      ],
      { cancelable: true }
    );
  };

  // --- Navigation Placeholder Functions ---
  const navigateToSettings = () => {
    console.log('Navigating to Settings screen...');
  };
  const navigateToList = () => {
    console.log('Navigating to List screen...');
  };
  const navigateToFocus = () => {
    console.log('Navigating to Focus screen...');
  };

  // --- Render Task Item ---
  const renderTaskItem = ({ item }: { item: Task }) => (
    // Use TouchableOpacity as the wrapper to capture both press types
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handleToggleTask(item.id)}
      onLongPress={() => handleLongPress(item)} // LONG PRESS HANDLER ADDED
      activeOpacity={0.7} // Visual feedback on touch
    >
      <Text style={[styles.taskText, item.isCompleted && styles.completedTaskText]}>
        {item.text}
      </Text>
      <View style={styles.checkbox}>
        {item.isCompleted ? (
          <AntDesign name="check" size={18} color="#000" />
        ) : (
          <View style={styles.emptyCheckbox} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.fullScreenWrapper}>
          
          {/* Content Area (Padded) */}
          <View style={styles.contentContainer}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>GetItDone</Text>
              <TouchableOpacity onPress={navigateToSettings}>
                <AntDesign name="setting" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Add Task Input and Button */}
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.taskInput}
                placeholder="What do you need to GetItDone?"
                placeholderTextColor="#888"
                value={newTaskText}
                onChangeText={setNewTaskText}
                onSubmitEditing={handleAddTask}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            {/* Task List / Empty State */}
            {tasks.length === 0 ? (
              <View style={styles.emptyListContainer}>
                <MaterialIcons name="event-note" size={50} color="#888" />
                <Text style={styles.emptyListText}>No tasks yet! Long press a task to delete it.</Text>
              </View>
            ) : (
              <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.taskList}
              />
            )}
            
          </View>
          
          {/* Bottom Navigation (Full Width) */}
          {/* Placed outside contentContainer to avoid padding */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={navigateToList}>
              <MaterialIcons name="format-list-bulleted" size={24} color="#FFF" />
              <Text style={styles.navText}>List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={navigateToFocus}>
              <MaterialIcons name="adjust" size={24} color="#FFF" />
              <Text style={styles.navText}>Focus</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={navigateToSettings}>
              <AntDesign name="setting" size={24} color="#FFF" />
              <Text style={styles.navText}>Settings</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  // New wrapper view to manage content and nav layout
  fullScreenWrapper: {
    flex: 1,
  },
  // Container for content that needs horizontal padding
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    // Ensures content doesn't overlap the fixed-height bottom nav
    paddingBottom: 70 + (Platform.OS === 'ios' ? 20 : 0), 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 30,
  },
  taskList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    color: '#FFF',
    fontSize: 18,
    flexShrink: 1,
    marginRight: 10,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  // BOTTOM NAV FIXES
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Ensures even distribution
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%', // Crucial for full width
    // Use padding bottom for iOS safe area (handles the home indicator bar)
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, 
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
    flex: 1, // Ensures each item takes equal horizontal space
  },
  navText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },
});

export default TaskListScreen;

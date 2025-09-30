// GetItDone/src/screens/FocusScreen.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal, // For the congratulatory message
  TouchableWithoutFeedback, // For closing modal by tapping outside
  Animated, // For simple animation on modal
  Easing, // For animation easing
  Platform,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // For navigation and getting params

// --- Type Definitions (You might want to put these in a shared types file later) ---
interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

// Define the route parameters for this screen if a task is passed
type FocusScreenRouteParams = {
  selectedTask?: Task; // Optional task object to pre-fill
};

type FocusScreenRouteProp = RouteProp<Record<string, FocusScreenRouteParams>, 'FocusScreen'>;

// --- FocusScreen Component ---

const FocusScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<FocusScreenRouteProp>();

  // State for the selected task (the one being focused on)
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Timer states
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // To store the timer interval

  // Congratulatory modal state
  const [showConfetti, setShowConfetti] = useState(false);
  const modalScale = useRef(new Animated.Value(0)).current; // For modal animation

  // --- Initialize Task from Navigation Parameters ---
  useEffect(() => {
    if (route.params?.selectedTask) {
      setCurrentTask(route.params.selectedTask);
      // You might also want to set a default timer based on the task type here
    }
  }, [route.params?.selectedTask]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prevSeconds => {
          if (prevSeconds <= 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (currentTask) { // Only show confetti if there was an active task
                setShowConfetti(true);
                startModalAnimation();
            }
            return 0; // Stop at 0
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Cleanup on unmount or when isRunning changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentTask]); // currentTask added to ensure useEffect reacts if task changes

  // Function to start or pause the timer
  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Function to stop the timer (e.g., when "Complete" is pressed)
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Only show confetti if a task was active and not just manually stopped at 0
    if (currentTask) {
        setShowConfetti(true);
        startModalAnimation();
    }
  }, [currentTask]);

  // Reset timer function (e.g., if user wants to set a new time)
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // --- Time Display Helpers ---
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: h < 10 ? `0${h}` : `${h}`,
      minutes: m < 10 ? `0${m}` : `${m}`,
      seconds: s < 10 ? `0${s}` : `${s}`,
    };
  };

  const time = formatTime(totalSeconds);

  // --- Modal Animation ---
  const startModalAnimation = () => {
    modalScale.setValue(0); // Start from 0
    Animated.spring(modalScale, {
      toValue: 1,
      friction: 5, // Controls bounciness
      tension: 60, // Controls speed
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setShowConfetti(false);
      resetTimer(); // Reset timer when modal is closed
      setCurrentTask(null); // Clear the current task
    });
  };

  // --- Navigation Placeholder Functions ---
  const navigateBack = () => navigation.goBack();
  const navigateToSettings = () => {
    console.log('Navigating to Settings screen...');
    // In a real app, you would use navigation.navigate('Settings') here.
  };
  const navigateToList = () => {
    console.log('Navigating to List screen...');
    // In a real app, you would use navigation.navigate('TaskList') here.
  };
  const navigateToFocus = () => {
    console.log('Navigating to Focus screen...');
    // This is the current screen.
  };

  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fullScreenWrapper}>
        
        {/* Content Area */}
        <View style={styles.contentContainer}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateBack} style={styles.menuButton}>
              <MaterialIcons name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Focus</Text>
            {/* Empty view for spacing, to center "Focus" title */}
            <View style={styles.menuButton} /> 
          </View>

          {/* Current Task Display */}
          <Text style={styles.currentTaskText}>
            {currentTask ? currentTask.text : 'Select a Task to Focus'}
          </Text>

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{time.hours}</Text>
              <Text style={styles.timerLabel}>Hours</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{time.minutes}</Text>
              <Text style={styles.timerLabel}>Minutes</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{time.seconds}</Text>
              <Text style={styles.timerLabel}>Seconds</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleTimer} // Start/Pause timer
              disabled={totalSeconds === 0 && !isRunning} // Disable if timer is 0 and not running
            >
              <Text style={styles.actionButtonText}>
                {isRunning ? 'Pause' : (totalSeconds > 0 ? 'Resume' : 'Start')}
              </Text>
            </TouchableOpacity>

            {/* Complete/Stop button */}
            {isRunning && ( // Only show "Complete" while running
                <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={stopTimer} // Stop and trigger confetti
                >
                    <Text style={styles.actionButtonText}>Complete</Text>
                </TouchableOpacity>
            )}

            {/* Button to set time (for demo, in real app, you'd have picker) */}
            {!isRunning && totalSeconds === 0 && (
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: '#555'}]}
                    onPress={() => setTotalSeconds(90 * 60)} // Set to 1 hour 30 min for example
                >
                    <Text style={styles.actionButtonText}>Set 1.5h</Text>
                </TouchableOpacity>
            )}
             {!isRunning && totalSeconds > 0 && (
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: '#777'}]}
                    onPress={resetTimer} 
                >
                    <Text style={styles.actionButtonText}>Reset</Text>
                </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={navigateToList}>
            <MaterialIcons name="format-list-bulleted" size={24} color="#FFF" />
            <Text style={styles.navText}>List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToFocus}>
            <MaterialIcons name="adjust" size={24} color="#1E90FF" /> {/* Highlight focus icon */}
            <Text style={[styles.navText, { color: '#1E90FF' }]}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToSettings}>
            <AntDesign name="setting" size={24} color="#FFF" />
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Congratulatory Modal */}
      <Modal
        animationType="none" // Controlled by Animated API
        transparent={true}
        visible={showConfetti}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.congratulatoryModal, { transform: [{ scale: modalScale }] }]}>
              <Text style={styles.congratulatoryText}>Task Completed!</Text>
              <Text style={styles.congratulatorySubText}>Great job getting it done!</Text>
              {currentTask && (
                <Text style={styles.completedTaskName}>"{currentTask.text}"</Text>
              )}
              <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
                <Text style={styles.closeModalButtonText}>Awesome!</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
  },
  fullScreenWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingBottom: 70 + (Platform.OS === 'ios' ? 20 : 0),
    alignItems: 'center', // Center content horizontally
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
    marginTop: 10,
  },
  menuButton: {
    padding: 5,
    width: 40, // Ensure consistent spacing
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  currentTaskText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    width: '90%', // Limit width for wrapping
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  timerBox: {
    backgroundColor: '#222',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: '30%', // Distribute evenly
  },
  timerValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerLabel: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 5,
  },
  actionButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButton: {
    backgroundColor: '#28a745', // A green color for complete
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Bottom Nav (re-used from TaskListScreen)
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
  },
  navText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black overlay
  },
  congratulatoryModal: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxWidth: '80%',
  },
  congratulatoryText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  congratulatorySubText: {
    color: '#EEE',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  completedTaskName: {
    color: '#1E90FF',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 30,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FocusScreen;
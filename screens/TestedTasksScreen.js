import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchTestedTasks } from '../util/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TestedTasksScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  
    const navigation = useNavigation();

    const loadTestedTasks = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                throw new Error("No userId found in AsyncStorage"); 
            }

            const testedTasks = await fetchTestedTasks();
            const userTestedTasks = testedTasks.filter(task => task.assignedToUserId === userId);
            setTasks(userTestedTasks);
            setError(null);  
        } catch (error) {
            console.error('Error fetching tested tasks:', error);
            setError('Error fetching tested tasks. Please try again.'); 
        } finally {
            setLoading(false);
        }
    };

   
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTestedTasks();
        });
        return unsubscribe;
    }, [navigation]);

    // Initial load
    useEffect(() => {
        loadTestedTasks();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading tested tasks...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;  
    }

    return (
        <View style={styles.container}>
            {tasks.length > 0 ? (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                            <Text style={styles.text}>Assigned to: {item.assignedTo}</Text>
                            <Text style={styles.text}>Due: {item.dueDate}</Text>
                            <Text style={styles.text}>Status: {item.status}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noTasksText}>No tasks to display for this user.</Text>
            )}
        </View>
    );
};
export default TestedTasksScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noTasksText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    taskItem: {
        backgroundColor: '#F0F0F0',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        
    },
    text: {
        fontSize: 14,
        fontWeight: '300',
        marginTop: 10
    },

});

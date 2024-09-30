import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { fetchTasksWithUserDetails } from '../util/firebase.js'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserTasksScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const loadUserTasks = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                console.error("No userId found in AsyncStorage");
                return;
            }

            const allTasks = await fetchTasksWithUserDetails();
            const userTasks = allTasks.filter(task => task.assignedToUserId === userId && task.status !== 'tested');
            setTasks(userTasks.length > 0 ? userTasks : []);
        } catch (error) {
            console.error("Error fetching user tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserTasks();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadUserTasks();
        });
        return unsubscribe;
    }, [navigation]);

    const handleTask = (task) => {
        navigation.navigate('TaskUserDetails', );

        navigation.setOptions({
            task,
            onTaskUpdated: loadUserTasks
        });
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading tasks...</Text>;
    }

    if (tasks.length === 0) {
        return <Text style={styles.noTasksText}>No tasks available for this user.</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleTask(item)}>
                        <View style={styles.taskCard}>
                            <Image source={require('../assets/Image/Task.png')} style={styles.image} />
                            <View>
                                <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                                <Text style={styles.text}>Assigned to: {item.assignedTo}</Text>
                                <Text style={styles.text}>Start Date: {item.startDate}</Text>
                                <Text style={styles.text}>End Date: {item.dueDate}</Text>
                                <Text style={styles.text}>Status: {item.status}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default UserTasksScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        height: 160,
        marginVertical: 15,
        marginHorizontal: 12
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        paddingLeft: 10
    },
    text: {
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 10
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    noTasksText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 40,
        marginLeft: 20
    },
    image: {
        width: 68,
        height: 68,
        marginTop: 25
    }
});

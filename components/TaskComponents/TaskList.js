import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TaskItem from './TaskItem';
import { useState, useEffect } from 'react';
import { fetchTasks } from '../../util/firebase';
import { fetchTasksWithUserDetails } from '../../util/firebase';


const tasks = [
    {
        id: '1',
        title: 'Validate Inputs',
        assignedTo: 'Jon Doe',
        status: 'In Progress',
        dueDate: '10/10/2024',
    },
    {
        id: '2',
        title: 'Validate Inputs',
        assignedTo: 'Jon Doe',
        status: 'In Progress',
        dueDate: '10/10/2024',
    },
    {
        id: '3',
        title: 'Validate Inputs',
        assignedTo: 'Jon Doe',
        status: 'In Progress',
        dueDate: '10/10/2024',
    },
];






function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        loadTasks();
    }, []);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTasks();
        });
        return unsubscribe;
    }, [navigation]);


    const loadTasks = async () => {
        try {
            const fetchedTasks = await fetchTasksWithUserDetails();
            setTasks(fetchedTasks);
        } catch (error) {

            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ACC1" />
            </View>
        );
    }



    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={({ item }) => <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('TaskDetails', {
                            title: item.taskTitle,
                            assignedTo: item.assignedTo,
                            StartDate: item.startDate,
                            EndDate: item.dueDate,
                            Status: item.status,
                            Description: item.description

                        })
                    }}>
                    <TaskItem task={item} />
                </TouchableOpacity>}
                keyExtractor={item => item.id}
            />
            <TouchableOpacity style={styles.fab} onPress={() => { navigation.navigate('Task') }}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        paddingVertical: 10,
        backgroundColor: '#00ACC1',
        textAlign: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        backgroundColor: '#F0F0F0'
    },
    iconContainer: {
        marginRight: 10,
        justifyContent: 'center',
    },
    taskInfo: {
        flex: 1,


    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#00ACC1',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        fontSize: 30,
        color: '#fff',
    },
    fontText: {
        fontWeight: 'bold',
        paddingVertical: 3
    },
    TaskImage: {
        width: 64,
        height: 64,
        marginBottom: 10

    }
});

export default TaskList;

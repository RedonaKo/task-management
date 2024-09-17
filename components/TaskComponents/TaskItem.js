
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';


function TaskItem({ task }) {

    return (
        <View style={styles.taskCard}>
            <View style={styles.iconContainer}>
                <Image source={require('../../assets/Image/Task.png')} style={styles.TaskImage} />
            </View>
            <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.taskTitle}</Text>
                <Text style={styles.fontText}>Assigned to: {task.assignedTo} </Text>
                <Text style={styles.fontText}>Status: {task.status}</Text>
                <Text style={styles.fontText}>Due Date: {task.dueDate}</Text>
            </View>
        </View>
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

export default TaskItem


import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TaskList from '../components/TaskComponents/TaskList';





function Tasks() {
    return (
        <TaskList />
    )
}

export default Tasks

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, KeyboardAvoidingView, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchUsersInput } from '../util/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { submitTask } from '../util/firebase';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Platform } from 'react-native';
import { useRef } from 'react';

export const TaskForm = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [user, setUser] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [showUserPicker, setShowUserPicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();








    const handleDateChange = (event, selectedDate, setDate) => {
        const currentDate = selectedDate || new Date();
        setDate(currentDate);

        if (event.type === 'set') {
            setShowStartDatePicker(false);
            setShowDueDatePicker(false);
        }
    };

    const handleSubmit = async () => {
        if (!taskTitle || !user || !startDate || !dueDate || !description) {
            Alert.alert('Validation Error', 'Please fill all fields before submitting.');
            return;
        }

        const taskData = {
            taskTitle,
            userId: user,
            startDate: format(startDate, 'yyyy-MM-dd'),
            dueDate: format(dueDate, 'yyyy-MM-dd'),
            description,
            picture: '',
            status: 'Pending',
        };

        try {
            setLoading(true);
            await submitTask(taskData);
            Alert.alert('Success', 'Task submitted successfully!');
            setTaskTitle('');
            setUser('');
            setStartDate(new Date());
            setDueDate(new Date());
            setDescription('');
        } catch (error) {
            console.error('Error adding task:', error.message);
            Alert.alert('Error', 'There was an error submitting the task. Please try again.');
        } finally {
            setLoading(false);
            navigation.navigate('Tasks');
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const fetchedUsers = await fetchUsersInput();
                if (fetchedUsers) {
                    setUsers(fetchedUsers);

                }
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : height}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    <Text style={styles.header}>Add Task</Text>
                    <View style={styles.form}>
                        <TextInput
                            placeholder='Task Title'
                            value={taskTitle}
                            onChangeText={setTaskTitle}
                            style={styles.inputTitle}
                        />

                        <TouchableOpacity style={styles.inputUser} onPress={() => setShowUserPicker(true)}>
                            <Text style={user ? styles.userText : styles.placeholderText}>
                                {user ? users.find(u => u.id === user)?.Name : 'Select User'}
                            </Text>
                        </TouchableOpacity>

                        {showUserPicker && (
                            <Modal
                                transparent={true}
                                animationType='slide'
                                visible={showUserPicker}
                                onRequestClose={() => setShowUserPicker(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.pickerContainer}>
                                        {loading ? (
                                            <ActivityIndicator size="large" color="#00796B" />
                                        ) : (
                                            <Picker
                                                selectedValue={user}
                                                style={styles.picker}
                                                onValueChange={(itemValue) => {
                                                    setUser(itemValue);
                                                    setShowUserPicker(false);
                                                }}
                                            >
                                                {users.map((item) => (
                                                    <Picker.Item key={item.id} label={`${item.Name} ${item.LastName}`} value={item.id} />
                                                ))}
                                            </Picker>
                                        )}
                                        <TouchableOpacity onPress={() => setShowUserPicker(false)} style={styles.closeButton}>
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        )}

                        <TouchableOpacity style={styles.inputUser} onPress={() => setShowStartDatePicker(true)}>
                            <Text style={startDate ? styles.userText : styles.placeholderText}>
                                {format(startDate, 'dd/MM/yyyy') || 'Select Start Date'}
                            </Text>
                        </TouchableOpacity>

                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode='date'
                                display='default'
                                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setStartDate)}
                            />
                        )}

                        <TouchableOpacity style={styles.inputUser} onPress={() => setShowDueDatePicker(true)}>
                            <Text style={dueDate ? styles.userText : styles.placeholderText}>
                                {format(dueDate, 'dd/MM/yyyy') || 'Select Due Date'}
                            </Text>
                        </TouchableOpacity>

                        {showDueDatePicker && (
                            <DateTimePicker
                                value={dueDate}
                                mode='date'
                                display='default'
                                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setDueDate)}
                            />
                        )}

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            onSubmitEditing={() => { Keyboard.dismiss(); }}
                            blurOnSubmit={true}

                        />

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
        paddingVertical: 10,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 60,
    },
    form: {
        backgroundColor: '#6AC5C8',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
    },
    inputTitle: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 15,
    },
    inputUser: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 10,
        padding: 11,
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: 15,
    },
    placeholderText: {
        color: '#999',
    },
    userText: {
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    picker: {
        width: '100%',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#00796B',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#00796B',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textArea: {
        minHeight: 140,
        textAlignVertical: 'top',
        width: '100%',
        marginTop: 14,
        padding: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        height: 35,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#356290',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TaskForm;

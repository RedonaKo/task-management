import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { deleteTask } from "../util/firebase";
import { Alert } from "react-native";
function TaskDetails({ route, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const { id, title, assignedTo, StartDate, EndDate, Status, Description } = route.params;
    function handleSubmit() {
        navigation.navigate('Tasks')
    }

    function handleDeleteTask() {
        deleteTask(id)
            .then((success) => {
                if (success) {
                    Alert.alert('Task Deleted', 'The task has been deleted successfully.');
                    setModalVisible(false);
                    navigation.navigate('Tasks');
                }
            })
            .catch((error) => {
                console.error('Error during task deletion:', error);
            });
    }


    return (
        <ScrollView>
            <View style={styles.view}>
                <Text style={styles.header1}>Task Details</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="ellipsis-vertical" size={35} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>{title}</Text>

            <View style={styles.form}>
                <Text style={styles.text}>Assigned to: {assignedTo}</Text>
                <Text style={styles.text}>Start Date: {StartDate}</Text>
                <Text style={styles.text}>End Date: {EndDate}</Text>
                <Text style={styles.text}>Status: {Status}</Text>
                <Text style={styles.text}>Description: {Description}</Text>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Mark as Done</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.editContainer}>
                        <Pressable
                            style={[styles.button2, styles.buttonClose]}
                            onPress={handleDeleteTask}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>

                        <Pressable style={[styles.button2, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    view: {
        backgroundColor: '#6AC5C8',
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'


    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 30,
        paddingBottom: 40
    },
    header1: {
        color: 'white',
        textAlign: 'center',
        paddingtop: 22,
        marginTop: 35,
        fontSize: 30,
        fontWeight: 'bold'

    },

    form: {
        backgroundColor: '#6AC5C8',
        borderRadius: 15,
        marginHorizontal: 15,
        paddingVertical: 25,
        paddingHorizontal: 15,
        height: '70%'
    },
    text: {
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 14
    },

    submitButton: {
        backgroundColor: '#356290',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 16,
        marginVertical: 20,
        marginHorizontal: 15


    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',



    },
    icon: {
        paddingLeft: 330,
        marginTop: -35,
        marginRight: 2


    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    editContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonClose: {
        marginBottom: 10,
        width: 100,
    },
    buttonText: {
        color: 'white',
        marginTop: 10,
    },
    button2: {
        width: 350,
        height: 40,
        backgroundColor: "#356290",
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        alignItems: 'center',
    }
})
export default TaskDetails;
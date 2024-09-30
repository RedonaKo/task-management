import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveTestedTask } from "../util/firebase";

const TaskUserDetails = () => {
    const route = useRoute();
    const { task, onTaskUpdated } = route.params; 
    const navigation = useNavigation();

    const handleTested = async () => {
        try {
            const success = await saveTestedTask(task);
            if (success) {
                Alert.alert('Success', 'Task marked as tested');

                
                if (onTaskUpdated) {
                    onTaskUpdated(); 
                }

                navigation.navigate('TestedTasks');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to mark task as tested');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Task Details </Text>
            <Text style={styles.textTitle}> {task.taskTitle}</Text>
            <View style={styles.view}>
                <Text style={styles.text}>Assigned to: {task.assignedTo}</Text>
                <Text style={styles.text}>Start Date: {task.startDate}</Text>
                <Text style={styles.text}>End Date: {task.dueDate}</Text>
                <Text style={styles.text}>Status: {task.status}</Text>
                <Text style={styles.text}>Description: {task.description}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleTested}>
                <Text style={styles.buttonText}>Mark as Tested</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TaskUserDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        color: 'white',
        backgroundColor: '#6AC5C8',
        height: 120,
        paddingTop: 58,
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textTitle: {
        marginTop: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35,
        marginBottom: 40
    },
    view: {
        backgroundColor: '#6AC5C8',
        height: 480,
        marginHorizontal: 10,
        borderRadius: 20,
        padding: 20,
        alignContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 17 ,
        marginTop: 25
    },
    button: {
        height: 45,
        width: '92%',
        backgroundColor: '#356290',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 250,
        padding: 15,
        marginLeft: 16
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        height: 20,
        marginTop: -5,
        textAlign: 'center'
    },
});

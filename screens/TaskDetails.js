import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
function TaskDetails({ route, navigation }) {
    function handleSubmit() {
        navigation.navigate('Tasks')
    }
    return (
        <View sty>
            <Text style={styles.header}>{route.params.title}</Text>

            <View style={styles.form}>
                <Text style={styles.text}>Assigned to: {route.params.assignedTo}</Text>
                <Text style={styles.text}>Start Date: {route.params.StartDate}</Text>
                <Text style={styles.text}>End Date: {route.params.EndDate}</Text>
                <Text style={styles.text}>Status: {route.params.Status}</Text>
                <Text style={styles.text}>Description: {route.params.Description}</Text>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Mark as Done</Text>
            </TouchableOpacity>
        </View>
    )



}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 30,
        paddingBottom: 40
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
})
export default TaskDetails;
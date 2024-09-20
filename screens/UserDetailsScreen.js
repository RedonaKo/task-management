import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, TouchableOpacity, View } from "react-native";
import { ScrollView, StyleSheet, Text } from "react-native";
import { deleteUser, fetchUsers } from "../util/firebase";
import { Country, State } from "country-state-city";


const UserDetailsScreen = ({ route, navigation }) => {
    
    const [user, setUser] = useState(route.params.user || {} );
    const [modalVisible, setModalVisible] = useState(false);

    const loadUsers = async () => {
        try {
            const fetchedUsers = await fetchUsers();
            const updatedUser = fetchedUsers.find(u => u.id === user.id);
            if (updatedUser) {
                setUser(updatedUser);
            } else {
                Alert.alert("Error", "User not found.");
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            Alert.alert("Error", "Failed to load users. Please try again.");
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadUsers();
        });

        if (route.params?.user) {
            setUser(route.params.user);
        }

        return unsubscribe;
    }, [navigation, route.params?.user]);



    function getCountryName(isoCode) {
        const country = Country.getCountryByCode(isoCode);
        return country?.name ?? 'null';
    }
    
    function getStateName(isoCode, country) {
        const state = State.getStateByCodeAndCountry(isoCode, country);
        return state?.name ?? 'null';
    }
    


  



    const handleDelete = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this user?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteUser(user.id);
                            Alert.alert("User Deleted");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Failed to delete user:", error);
                            Alert.alert("Error", "Failed to delete the user. Please try again.");
                        }
                    },
                },
            ]
        );
    };



    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>User details are not available.</Text>
            </View>
        );
    }

  

   

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.view}>
                <Text style={styles.text}>User</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="ellipsis-vertical" size={35} style={styles.icon} />
                </TouchableOpacity>
            </View>

            <Text style={styles.name}>
                {user.Name} {user.LastName}
            </Text>
            <View style={styles.viewDetails}>
                <View style={styles.viewData}>
                    <Text style={styles.data}>Email: {user.Email}</Text>
                    <Text style={styles.data}>
                        Birthdate: {user.Birthday ? new Date(user.Birthday).toDateString() : "null"}
                    </Text>
                     <Text style={styles.data}>Country: {getCountryName(user.Country)}</Text>
                    <Text style={styles.data}>State: {getStateName(user.State, user.Country)}</Text>   
                    <Text style={styles.data}>City: {user.City}</Text>
                    <Text style={styles.data}>Number of tasks: {user.tasks}</Text>
                    <Text style={styles.data}>Tasks Finished: {user.done}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View User Task</Text>
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
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("EditUser", { user });
                            }}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.buttonClose]} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    view: {
        backgroundColor: '#6AC5C8',
        width: 390,
        height: 120,
    },
    text: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        paddingTop: 22,
        fontWeight: 'bold',
        marginTop: 35,
    },
    icon: {
        paddingLeft: 330,
        marginTop: -31,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 55,
    },
    viewDetails: {
        backgroundColor: '#6AC5C8',
        width: 360,
        height: 100,
        flex: 1,
        borderRadius: 20,
        marginTop: 25,
    },
    viewData: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 20,
        paddingTop: 35,
    },
    data: {
        paddingBottom: 30,
        color: 'white',
    },
    button: {
        width: 350,
        height: 40,
        backgroundColor: "#356290",
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        marginTop: 10,
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
});


export default UserDetailsScreen;
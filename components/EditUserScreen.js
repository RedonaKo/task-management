import { useState, useEffect } from "react";
import { Alert, TextInput, Pressable, View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { updateUser } from "../util/firebase";
import { City, Country, State } from "country-state-city";
import { Picker } from "@react-native-picker/picker";

const EditUserScreen = ({ route, navigation }) => {
    const { user } = route.params || {};

    const [editableUser, setEditableUser] = useState({
        Name: user?.Name || "",
        LastName: user?.LastName || "",
        Email: user?.Email || "",
        Birthday: user?.Birthday || "",
        Country: user?.Country || "",
        State: user?.State || "",
        City: user?.City || "",
        tasks: user?.tasks || 0,
        done: user?.done || 0,
    });

    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showStatePicker, setShowStatePicker] = useState(false);
    const [showCityPicker, setShowCityPicker] = useState(false);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (editableUser.Country) {
            const fetchedStates = State.getStatesOfCountry(editableUser.Country);
            setStates(fetchedStates);
            if (editableUser.State) {
                const fetchedCities = City.getCitiesOfState(editableUser.Country, editableUser.State);
                setCities(fetchedCities);
            }
        }
    }, [editableUser.Country, editableUser.State]);

    const handleSave = async () => {
        try {
            await updateUser(user.id, editableUser);
            Alert.alert("User updated successfully!");
            navigation.navigate("Users", { user: editableUser });
        } catch (error) {
            console.error('Failed to update user: ', error);
            Alert.alert("Error", "Failed to update user. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.view}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={editableUser.Name}
                    onChangeText={(text) => setEditableUser({ ...editableUser, Name: text })}
                />
                  <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={editableUser.LastName}
                onChangeText={(text) => setEditableUser({ ...editableUser, LastName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={editableUser.Email}
                onChangeText={(text) => setEditableUser({ ...editableUser, Email: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Birthdate"
                value={editableUser.Birthday}
                onChangeText={(text) => setEditableUser({ ...editableUser, Birthday: text })}
            />
                <TouchableOpacity style={styles.pickerInput} onPress={() => setShowCountryPicker(true)}>
                    <Text style={styles.pickerText}>
                        {Country.getCountryByCode(editableUser.Country)?.name || 'Select Country'}
                    </Text>
                </TouchableOpacity>
                {showCountryPicker && (
                    <Modal transparent={true} animationType="slide" visible={showCountryPicker} onRequestClose={() => setShowCountryPicker(false)}>
                        <View style={styles.modalContainer}>
                            <Picker selectedValue={editableUser.Country} style={styles.picker} onValueChange={(itemValue) => {
                                setEditableUser({ ...editableUser, Country: itemValue, State: '', City: '' });
                                setShowCountryPicker(false);
                            }}>
                                {Country.getAllCountries().map((country) => (
                                    <Picker.Item key={country.isoCode} label={country.name} value={country.isoCode} />
                                ))}
                            </Picker>
                        </View>
                    </Modal>
                )}
                {states.length > 0 && (
                    <>
                        <TouchableOpacity style={styles.pickerInput} onPress={() => setShowStatePicker(true)}>
                            <Text style={styles.pickerText}>
                                {editableUser.State ? State.getStateByCodeAndCountry(editableUser.State, editableUser.Country)?.name : 'Select State'}
                            </Text>
                        </TouchableOpacity>
                        {showStatePicker && (
                            <Modal transparent={true} animationType="slide" visible={showStatePicker} onRequestClose={() => setShowStatePicker(false)}>
                                <View style={styles.modalContainer}>
                                    <Picker selectedValue={editableUser.State} style={styles.picker} onValueChange={(itemValue) => {
                                        setEditableUser({ ...editableUser, State: itemValue, City: '' });
                                        setShowStatePicker(false);
                                    }}>
                                        {states.map((state) => (
                                            <Picker.Item key={state.isoCode} label={state.name} value={state.isoCode} />
                                        ))}
                                    </Picker>
                                </View>
                            </Modal>
                        )}
                    </>
                )}
                {cities.length > 0 && (
                    <>
                        <TouchableOpacity style={styles.pickerInput} onPress={() => setShowCityPicker(true)}>
                            <Text style={styles.pickerText}>
                                {editableUser.City || 'Select City'}
                            </Text>
                        </TouchableOpacity>
                        {showCityPicker && (
                            <Modal transparent={true} animationType="slide" visible={showCityPicker} onRequestClose={() => setShowCityPicker(false)}>
                                <View style={styles.modalContainer}>
                                    <Picker selectedValue={editableUser.City} style={styles.picker} onValueChange={(itemValue) => {
                                        setEditableUser({ ...editableUser, City: itemValue });
                                        setShowCityPicker(false);
                                    }}>
                                        {cities.map((city) => (
                                            <Picker.Item key={city.name} label={city.name} value={city.name} />
                                        ))}
                                    </Picker>
                                </View>
                            </Modal>
                        )}
                    </>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Number of tasks"
                    keyboardType="numeric"
                    value={editableUser.tasks.toString()}
                    onChangeText={(text) => setEditableUser({ ...editableUser, tasks: parseInt(text) })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tasks Finished"
                    keyboardType="numeric"
                    value={editableUser.done.toString()}
                    onChangeText={(text) => setEditableUser({ ...editableUser, done: parseInt(text) })}
                />
                <Pressable style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
         flex: 1,
        justifyContent: "center", 
        padding: 20, 
        backgroundColor: 'white' 
    },
    view: {
         backgroundColor: '#6AC5C8', 
         width: 350, height: 600, 
         paddingTop: 20, 
         paddingLeft: 30, 
         borderRadius: 20 
        },
    input: {
         backgroundColor: 'white', 
         width: '90%', 
         height: 40, 
         borderWidth: 1, 
         borderRadius: 3, 
         marginBottom: 15, 
         paddingHorizontal: 10 
        },
    button: {
         backgroundColor: "#356290", 
         padding: 10, 
         borderRadius: 5, 
         alignItems: 'center', 
         width: '90%'
         },
    buttonText: {
         color: 'white' 
        },
    pickerInput: {
         backgroundColor: 'white', 
         width: '90%', 
         height: 40, 
         borderWidth: 1, 
         borderRadius: 3, 
         marginBottom: 15, 
         justifyContent: 'center', 
         paddingHorizontal: 10 
        },
    pickerText: {
         color: '#000'
         },
    modalContainer: {
         flex: 1, 
         justifyContent: 'center', 
         alignItems: 'center', 
         backgroundColor: 'rgba(0,0,0,0.5)'
         },
    picker: {
         width: 300, 
         backgroundColor: 'white', 
         borderRadius: 10
         }
});


export default EditUserScreen;

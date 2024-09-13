import { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, Text, Alert } from 'react-native'
import { reauthenticateUser } from '../util/reset';
import { updatePassword } from '../util/reset';



export default function ResetPw({ navigation }) {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const validateForm = () => {
        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
            return false;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return false;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirmation password do not match.');
            return false;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long.');
            return false;
        }

        return true;
    };


    const handleResetPassword = async () => {
        if (!validateForm()) return;

        try {

            const idToken = await reauthenticateUser(email, oldPassword);
            if (idToken) {

                await updatePassword(idToken, newPassword);
                Alert.alert('Success', 'Password has been updated successfully.');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error during Reset:', error.message);
            Alert.alert('Error', error.message);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <Image style={styles.image} source={require('../assets/Image/image.png')} />
            </View>

            <View style={styles.container2}>
                <TextInput
                    style={styles.emailInput}
                    placeholder='Email'
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}

                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder='Old Password'
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder='New Password'
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder='Confirm New Password'
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                < TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
                    <Text style={styles.txt}>Reset</Text>
                </TouchableOpacity >

            </View>
        </ScrollView>

    )
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container2: {
        width: '90%',
        height: 750,

    },
    image: {
        width: 160,
        height: 180,
        resizeMode: 'contain',

    },
    container2: {
        backgroundColor: '#6AC5C8',
        width: 500,
        height: 750,
        marginTop: 60,

    },

    emailInput: {
        height: 55,
        backgroundColor: '#fff',
        marginTop: 30,
        marginLeft: 70,
        marginRight: 70,
        paddingLeft: 10,
        fontSize: 15,
        borderRadius: 5
    },
    passwordInput: {
        backgroundColor: '#fff',
        height: 55,
        marginTop: 30,
        marginLeft: 70,
        marginRight: 70,
        paddingLeft: 10,
        fontSize: 15,
        borderRadius: 5
    },
    btn: {
        backgroundColor: '#356290',
        marginTop: 30,
        height: 45,
        marginLeft: 70,
        marginRight: 70,
        borderRadius: 5,
        alignItems: 'center',
        paddingTop: 15,
    },
    txt: {
        color: '#fff'
    },


})
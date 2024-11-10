import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { AuthContext } from '../context/authContext';
import { loginUser, getUserData } from '../util/firebase';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useContext(AuthContext);
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!password) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        setError('');
        return true;
    };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
        const result = await loginUser(email, password);
        if (result && result.token) {
            const { userData } = result;
            const { role, Name, LastName, birthdate } = userData;

            // Debugging logs
            console.log('User data fetched:', userData);
            console.log('Role:', role);
            console.log('Name:', Name);
            console.log('LastName:', LastName);
            console.log('Birthdate:', birthdate);

            // Ensure Name and LastName are passed to signIn
            if (Name && LastName && birthdate) {
                await signIn(result.token, role, Name, LastName, birthdate);
                if (role === 'admin') {
                    navigation.navigate('AdminHome',  { name: Name, lastName: LastName });
                } else {
                    navigation.navigate('Users Page', { name: Name, lastName: LastName });
                }
            } else {
                Alert.alert('Login Error', 'User name or last name is missing.');
            }
        } else {
            Alert.alert('Error', 'Unable to login. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Login Error', 'An unexpected error occurred. Please try again later.');
    }
};


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <Image
                    style={styles.image}
                    source={require('../assets/Image/image.png')}
                />
            </View>
            <View style={styles.container2}>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                    <Text style={styles.txt}>Login</Text>
                </TouchableOpacity>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Text style={styles.accText} onPress={() => navigation.navigate('Register')}>
                    Don't Have Account?
                    <Text style={styles.register}> Register</Text>
                </Text>
                
                <Text style={styles.footerText} onPress={() => navigation.navigate('Reset')}>
                    Reset Password
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 160,
        height: 180,
        resizeMode: 'contain',
        marginTop: 50
    },
    container2: {
        backgroundColor: '#6AC5C8',
        width: 500,
        height: 750,
        marginTop: 60
    },
    emailInput: {
        height: 55,
        backgroundColor: '#fff',
        marginTop: 70,
        marginLeft: 70,
        marginRight: 70,
        paddingLeft: 10,
        fontSize: 15,
        borderRadius: 5
    },
    passwordInput: {
        backgroundColor: '#fff',
        height: 55,
        marginTop: 50,
        marginLeft: 70,
        marginRight: 70,
        paddingLeft: 10,
        fontSize: 15,
        borderRadius: 5
    },
    btn: {
        backgroundColor: '#356290',
        marginTop: 50,
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
    accText: {
        paddingTop: 20,
        textAlign: 'center',
        color: '#fff',
        fontSize: 15
    },
    register: {
        color: '#356290'
    },
    footerText: {
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 15,
        color: '#356290'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    }
});

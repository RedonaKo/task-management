import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../util/firebase';  // Import your register function

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        lastName: '',
        birthday: '',
        country: '',
        city: ''
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const { email, password, name, lastName, birthday, country, city } = formData;
        if (!email || !password || !name || !lastName || !birthday || !country || !city) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }
        registerUser(email, password, name, lastName, birthday, country, city);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Birthday (YYYY-MM-DD)"
                value={formData.birthday}
                onChangeText={(value) => handleChange('birthday', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Country"
                value={formData.country}
                onChangeText={(value) => handleChange('country', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleChange('city', value)}
            />
            <Button title="Register" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default UserRegistrationForm;

import axios from "axios";
import { Alert } from "react-native";

const API_KEY = 'AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE';

export async function registerUser(email, password, name, lastName, birthday, country, city, base64Image) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
        const response = await axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        const userId = response.data.localId;

        await axios.put(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`, {
            Name: name,
            LastName: lastName,
            Birthday: birthday,
            City: city,
            Country: country,
            Image: base64Image,
        });

        console.log("User data saved in Realtime Database.");

        const token = response.data.idToken;
        console.log("Registration Successful. Token:", token);
        return token;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            console.error('Registration Error:', errorMessage);
            Alert.alert('Registration failed', errorMessage);
        } else {
            console.error('Unexpected registration error:', error);
            Alert.alert('Registration failed', 'An unexpected error occurred. Please try again.');
        }
        return null;
    }
}


export async function loginUser(email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    try {
        const response = await axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        const token = response.data.idToken;
        const userId = response.data.localId;

        console.log("Login Successful. Token:", token);

        // Fetch user data from Realtime Database
        const userResponse = await axios.get(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`);

        console.log("User data retrieved:", userResponse.data);

        return {
            token,
            userData: userResponse.data
        };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            console.error('Login Error:', errorMessage);
            Alert.alert('Login failed', errorMessage);
        } else {
            console.error('Unexpected login error:', error);
            Alert.alert('Login failed', 'An unexpected error occurred. Please try again.');
        }
        return null;
    }
}

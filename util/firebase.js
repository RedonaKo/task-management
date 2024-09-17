import axios from "axios";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";

const API_KEY = 'AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE';

// Function to register a user
export async function registerUser(email, password, name, lastName, birthday, city, country, role) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
        const response = await axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        const userId = response.data.localId;

        // Save user data in Firebase Realtime Database
        await axios.put(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`, {
            Name: name,
            LastName: lastName,
            Birthday: birthday,
            City: city,
            Country: country,
            Role: role
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

// Function to login a user
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

        // Fetch user data from Firebase Realtime Database
        const userResponse = await axios.get(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`);

        console.log("User data retrieved:", userResponse.data);

        const userData = userResponse.data;
        const role = userData.Role || 'user';
        const name = userData.Name;
        const lastName = userData.LastName;

        console.log("Name", name, "Lastname", lastName);

        return {
            token,
            userData: {
               ...userData,
                role,
            },
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

// Function to get JWT payload
export const getJwtPayload = (token) => {
    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        return { decoded, role };
    } catch (error) {
        return { decoded: null, role: null };
    }
};

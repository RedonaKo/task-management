import axios from "axios";
import { Alert } from "react-native";

const API_KEY = 'AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE';

export async function registerUser(email, password, name, lastName, birthday, country, state, city, base64Image, role) {
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
            State: state,
            Image: base64Image,
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


// Fetch all users  with role user from Firebase
export async function fetchUsers(role = "user") {
    try {
        const response = await axios.get(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User.json`);
        const users = response.data;

        if (!users) {
            console.error('No users found');
            return [];
        }

     
        const userList = Object.keys(users)
            .map((key) => ({ id: key, ...users[key] }))
            .filter((user) => user.Role === role);

        console.log('Fetched Users:', userList); 
        return userList;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        Alert.alert('Error', 'Failed to fetch users. Please try again later.');
        return [];
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

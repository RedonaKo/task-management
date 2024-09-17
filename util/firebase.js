import axios from "axios";
import { Alert } from "react-native";
<<<<<<< HEAD
import jwtDecode from "jwt-decode";
=======
import { format } from "date-fns";

>>>>>>> b25eede33f84dffeca381363404bb4bca567acbe

const API_KEY = 'AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE';
const FIREBASE_DB_URL = 'https://task-menagement-64e90-default-rtdb.firebaseio.com/Tasks.json';

<<<<<<< HEAD
// Function to register a user
export async function registerUser(email, password, name, lastName, birthday, city, country, role) {
=======
export async function registerUser(email, password, name, lastName, birthday, country, state, city, base64Image, role) {
>>>>>>> b25eede33f84dffeca381363404bb4bca567acbe
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
<<<<<<< HEAD
=======
            State: state,
            Image: base64Image,
>>>>>>> b25eede33f84dffeca381363404bb4bca567acbe
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

<<<<<<< HEAD
        // Fetch user data from Firebase Realtime Database
=======

>>>>>>> b25eede33f84dffeca381363404bb4bca567acbe
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
<<<<<<< HEAD

// Function to get JWT payload
export const getJwtPayload = (token) => {
    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        return { decoded, role };
    } catch (error) {
        return { decoded: null, role: null };
=======
const BASE_URL = 'https://task-menagement-64e90-default-rtdb.firebaseio.com/User.json';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});



export async function fetchUsersInput(role = "user") {
    try {
        const url = `?orderBy="Role"&equalTo="${role}"`;
        console.log('Request URL:', url);

        const response = await axiosInstance.get(url);
        console.log('Response data:', response.data);

        const users = response.data;

        if (!users) {
            console.error('No users found');
            return [];
        }


        const userList = Object.keys(users).map((key) => ({ id: key, ...users[key] }));

        return userList;
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch users. Please try again later.');
        return [];
    }
}


export const submitTask = async (taskData) => {
    try {

        if (!taskData.userId) {
            throw new Error('User ID is required');
        }

        const response = await axios.post(`${FIREBASE_DB_URL}?key=${API_KEY}`, {
            fields: {
                taskTitle: { stringValue: taskData.taskTitle },
                UserId: { stringValue: taskData.userId },
                StartDate: { stringValue: format(taskData.startDate, 'yyyy-MM-dd') },
                EndDate: { stringValue: format(taskData.dueDate, 'yyyy-MM-dd') },
                Description: { stringValue: taskData.description },
                Picture: { stringValue: taskData.picture || '' },
                Status: { stringValue: taskData.status || 'Pending' },
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to submit task');
        }

        return response.data;
    } catch (error) {
        console.error('Error submitting task:', error.message);
        throw new Error(error.message || 'Error submitting task');
    }
};


export const fetchTasks = async () => {
    try {
        const response = await axios.get(`https://task-menagement-64e90-default-rtdb.firebaseio.com/Tasks.json`);

        if (response.status !== 200) {
            throw new Error('Failed to fetch tasks');
        }


        console.log('Fetched data:', response.data);

        const tasks = Object.keys(response.data || {}).map(key => {
            const fields = response.data[key].fields;
            return {
                id: key,
                taskTitle: fields.taskTitle?.stringValue || 'No Title',
                assignedTo: fields.UserId?.stringValue || 'Unassigned',
                status: fields.Status?.stringValue || 'No Status',
                dueDate: fields.EndDate?.stringValue || 'No Due Date',
                startDate: fields.StartDate?.stringValue || 'No Start Date',
                description: fields.Description?.stringValue || 'No Description',
                picture: fields.Picture?.stringValue || '',
            };
        });

        console.log('Mapped tasks:', tasks);
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        throw error;
    }
};


export const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        throw error;
    }
};

export const fetchTasksWithUserDetails = async () => {
    try {
        const tasks = await fetchTasks();
        const tasksWithUserDetails = await Promise.all(tasks.map(async (task) => {
            const userDetails = await fetchUserDetails(task.assignedTo);
            return {
                ...task,
                assignedTo: `${userDetails.Name} ${userDetails.LastName}`
            };
        }));
        return tasksWithUserDetails;
    } catch (error) {
        console.error('Error fetching tasks with user details:', error.message);
        throw error;
>>>>>>> b25eede33f84dffeca381363404bb4bca567acbe
    }
};

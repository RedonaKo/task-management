import axios from "axios";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";
import { format } from "date-fns";

const API_KEY = 'AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE';
const FIREBASE_DB_URL = 'https://task-menagement-64e90-default-rtdb.firebaseio.com/Tasks.json';


// Function to register a user
export async function registerUser(email, password, name, lastName, birthday, country, state, city, base64Image, role) {
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
            Country: country,
            State: state,
            City: city,
            Image: base64Image,
            Role: role,
            Email: email

        });

        console.log("User data saved in Realtime Database.");

        const token = response.data.idToken;
        console.log("Registration Successful. Token:", token);
        return token;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            Alert.alert('Registration failed', errorMessage);
        } else {
            Alert.alert('Registration failed', 'An unexpected error occurred. Please try again.');
        }
        return null;
    }
}



export async function fetchUsers(role = "user") {
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

        const userData = userResponse.data;

        // Add null checks
        if (!userData) {
            Alert.alert('Data Error', 'User data is missing or incomplete.');
            return null;
        }

        const role = userData.Role || 'user';
        const name = userData.Name || 'Unknown';
        const lastName = userData.LastName || 'Unknown';


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

// Update an existing user's data 
export async function updateUser(userId, updatedUser) {
    try {
        await axios.patch(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`, updatedUser);
        console.log(`User with ID ${userId} updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to update user. Please try again later.');
    }
}


// Delete a user 
export async function deleteUser(userId) {
    try {
        await axios.delete(`https://task-menagement-64e90-default-rtdb.firebaseio.com/User/${userId}.json`);
        console.log(`User with ID ${userId} deleted successfully.`);

    } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to delete user. Please try again later.');
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
            try {
                const userDetails = await fetchUserDetails(task.assignedTo);

                if (!userDetails || !userDetails.Name || !userDetails.LastName) {
                    return {
                        ...task,
                        assignedTo: 'Unknown User',
                    };
                }

                return {
                    ...task,
                    assignedTo: `${userDetails.Name} ${userDetails.LastName}`,
                };
            } catch (userError) {
                console.error(`Error fetching details for user ID ${task.assignedTo}:`, userError.message);
                return {
                    ...task,
                    assignedTo: 'Error Fetching User',
                };
            }
        }));

        return tasksWithUserDetails;
    } catch (error) {
        console.error('Error fetching tasks with user details:', error.message);
        throw error;
    }
};

export async function deleteTask(taskKey) {
    try {
        // Ensure the taskKey is provided
        if (!taskKey) {
            throw new Error('Task key is required for deletion');
        }

        // Construct the URL with the taskKey
        const url = `https://task-menagement-64e90-default-rtdb.firebaseio.com/Tasks/${taskKey}.json`;

        // Perform the delete request
        const response = await axios.delete(url);

        // Check if the task was successfully deleted
        if (response.status === 200) {
            console.log(`Task with key ${taskKey} deleted successfully.`);
            return true;
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error.message);
        Alert.alert('Error', 'Failed to delete task. Please try again later.');
        return false;
    }
}



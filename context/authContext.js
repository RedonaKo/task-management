import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const role = await AsyncStorage.getItem('userRole');
                const name = await AsyncStorage.getItem('userName') || '';
                const lastName = await AsyncStorage.getItem('userLastName') || '';

                if (token) setUserToken(token);
                if (role) setUserRole(role);
                setUserName(name);
                setUserLastName(lastName);
            } catch (error) {
                console.error('Failed to load user data:', error); 
            }
        };

        loadUserData();
    }, []);

    const signIn = async (token, role, name, lastName) => {
        try {
            if (!token || !role || !name || !lastName) {
                throw new Error('Missing required parameters.');
            }

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userLastName', lastName);

            setUserToken(token);
            setUserRole(role);
        } catch (error) {
            console.error('Failed to sign in:', error);
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userLastName');

            setUserToken(null);
            setUserRole(null);
            setUserName(null);
            setUserLastName(null);
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, userRole, userName, userLastName, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

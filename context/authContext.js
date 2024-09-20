import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);
    const [userBirthdate, setUserBirthdate] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const role = await AsyncStorage.getItem('userRole');
                const name = await AsyncStorage.getItem('userName') || '';
                const lastName = await AsyncStorage.getItem('userLastName') || '';
                const birthdate = await AsyncStorage.getItem('userBirthdate') || '';    

                if (token) setUserToken(token);
                if (role) setUserRole(role);
                setUserName(name);
                setUserLastName(lastName);
                setUserBirthdate(birthdate);
            } catch (error) {
                console.error('Failed to load user data:', error); 
            }
        };

        loadUserData();
    }, []);

    const signIn = async (token, role, name, lastName, birthdate) => {
        try {
            if (!token || !role || !name || !lastName || !birthdate) {
                throw new Error('Missing required parameters.');
            }

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userLastName', lastName);
            await AsyncStorage.setItem('userBirthdate', birthdate || '');

            setUserToken(token);
            setUserRole(role);
            setUserName(name);
            setUserLastName(lastName);
            setUserBirthdate(birthdate);
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
            await AsyncStorage.removeItem('userBirthdate'); 

            setUserToken(null);
            setUserRole(null);
            setUserName(null);
            setUserLastName(null);
            setUserBirthdate(null);
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, userRole, userName, userLastName, userBirthdate, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

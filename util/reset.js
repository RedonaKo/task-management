import axios from "axios";
import { Alert } from "react-native";
const API_KEY = "AIzaSyC-C5bvScl98C_ocnDaEarrDFPpA7aq_uE";


export const reauthenticateUser = async (email, oldPassword) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: oldPassword,
                returnSecureToken: true,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return data.idToken;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        throw new Error('Re-authentication failed: ' + error.message);
    }
};


export const updatePassword = async (idToken, newPassword) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken: idToken,
                password: newPassword,
                returnSecureToken: true,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        throw new Error('Password update failed: ' + error.message);
    }
};

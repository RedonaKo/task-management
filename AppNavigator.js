import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  AuthContext} from './context/authContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPw from './screens/ResetPw';
import AdminTabs from './components/AdminTabs';
import UserTabs from './components/UserTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { userToken, userRole } = useContext(AuthContext);

    return (
        <Stack.Navigator initialRouteName="Login">
            {userToken ? (
                userRole === 'admin' ? (
                    <Stack.Screen name="AdminHome" component={AdminTabs} />
                ) : (
                    <Stack.Screen name="UserHome" component={UserTabs} />
                )
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Reset" component={ResetPw} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
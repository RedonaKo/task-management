import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPw from './screens/ResetPw';
import HomeScreen from './screens/HomeScreen';
import UsersScreen from './screens/UsersScreen';
import UserScreen from './screens/UserScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Reset" component={ResetPw} />
        <Stack.Screen name="Home" component={HomeScreen} /> */}
         <Stack.Screen name="Users" component={UsersScreen} />
         <Stack.Screen name="User" component={UserScreen} />
         

      </Stack.Navigator>
   


   

    </NavigationContainer>
  );
}
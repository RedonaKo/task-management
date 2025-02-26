<<<<<<< HEAD
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/authContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPw from './screens/ResetPw';
import AdminTabs from './components/AdminTabs';
import UserTabs from './components/UserTabs';
import AddTask from './screens/AddTask';
import TaskDetails from './screens/TaskDetails';
import UserDetailsScreen from './screens/UserDetailsScreen';
import UserScreen from './screens/UserScreen';
import EditUserScreen from './components/EditUserScreen';
import UsersScreen from './screens/UsersScreen';
import ProfileScreen from './screens/ProfileScreen';


import UserTasksScreen from './screens/UserTasksScreen';
import TaskUserDetails from './screens/TaskUserDetails';
import TestedTasksScreen from './screens/TestedTasksScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <AuthProvider>  
   
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen 
                    name="Users Page" 
                    component={UserTabs} 
                    options={{ 
                        headerShown: false 
                    }} 
                />
                <Stack.Screen 
                  name="AdminHome" 
                  component={AdminTabs} 
                  options={{
                    headerShown: false
                  }}
                />
                <Stack.Screen name="Reset" component={ResetPw}/>
                <Stack.Screen name="AddTask" component={AddTask}/>
                <Stack.Screen name='TaskDetails' component={TaskDetails}/>

                <Stack.Screen name='Users' component={UsersScreen}
                 options={{
                  headerShown: false
                }}/>
                <Stack.Screen name='User' component={UserScreen}
                 options={{
                  headerShown: false
                }}/>
                <Stack.Screen name='UserDetails' component={UserDetailsScreen}
                 options={{
                  headerShown: false
                }}/>
      <Stack.Screen name='UserTasks' component={UserTasksScreen}
                  options={{
                    headerShown: false
                  }}/>
                  <Stack.Screen name='TaskUserDetails' component={TaskUserDetails}
                   options={{
                    headerShown: false
                  }}/>
                  
                   <Stack.Screen name='TestedTasks' component={TestedTasksScreen}/>
                   <Stack.Screen name='Profile' component={ProfileScreen}/>

                   
                
            


            </Stack.Navigator>
        </NavigationContainer>

        </AuthProvider>  

 

  );
}
>>>>>>> c21cbaeca5cce5fa9f96fa77448f1b28e82b2fd0

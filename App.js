import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6AC5C8' ,
          height: 115,
        },
        headerTintColor: 'white',
        contentStyle: {backgroundColor: '#6AC5C8'},
        headerTitleStyle: { fontSize: 30 },
        
      }}  >
        <Stack.Screen name="Register" component={RegisterScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    color: 'white',
    backgroundColor : '#6AC5C8',
    width: 420,
    height: 148
  }

});

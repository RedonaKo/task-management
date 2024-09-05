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
            backgroundColor: '#6AC5C8',
            height: 100, 
          },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: '#6AC5C8' },
          headerTitleStyle: { fontSize: 24 }, 
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
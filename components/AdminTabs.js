import React from 'react';
import TasksScreen from '../screens/TasksScreen';
import UserScreen from '../screens/UserScreen';
import ReportScreen from '../screens/ReportScreen';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminHeader = ({name, lastName}) => {
    const initialName = name ? name[0].toUpperCase() : '';
    const initialLastName = lastName ? lastName[0].toUpperCase() : '';

  return(
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Admin Page</Text>
     <View style={styles.container}>
        <Text style={styles.text}>{initialName + initialLastName}</Text>
      </View>
    </View>
  );
}

const AdminTabs = ({route}) => {
    const { name, lastName } = route.params; 
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Admin Tabs'
                component={BottomTabs}
                options={{
                    header: () => <AdminHeader name={name} lastName={lastName}/>,
                    headerStyle:{backgroundColor:'#6AC5C8'}
                }}
            />
        </Stack.Navigator>
    )
}

const BottomTabs = () => (
    <Tab.Navigator 
        screenOptions={({ route }) => ({  
            tabBarStyle: { backgroundColor: '#6AC5C8', height: 100 },
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Tasks') {
                    iconName = 'checkmark-done-outline'; 
                } else if (route.name === 'Users') {
                    iconName = 'people-outline'; 
                } else if (route.name === 'Reports') {
                    iconName = 'bar-chart-outline'; 
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: 'black',
        })}
    >
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Users" component={UserScreen} />
        <Tab.Screen name="Reports" component={ReportScreen} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
  headerContainer: {
    height: 125,
    backgroundColor: '#6AC5C8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 100
  },
  container: {
    backgroundColor: '#BD06D9',
    width: 65,
    height: 65,
    borderRadius: 40,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminTabs;

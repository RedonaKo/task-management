import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportScreen from '../screens/ReportScreen';
import DoneTaskScreen from '../screens/DoneTasksScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
<<<<<<< HEAD
import UserTasksScreen from '../screens/UserTasksScreen';
import TestedTasksScreen from '../screens/TestedTasksScreen';
import TaskUserDetails from '../screens/TaskUserDetails';
=======
import ReportUserScreen from '../screens/ReportUserScreen';
>>>>>>> 0415f1e32d8bb0a0899f7f0cca3f9157afe74c06

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomHeader = ({ name, lastName, navigation}) => {
    const initialName = name ? name[0].toUpperCase() : '';
    const initialLastName = lastName ? lastName[0].toUpperCase() : '';


  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>User Page</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>  
          <Text style={styles.text}>{initialName + initialLastName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserTabs = ({navigation, route}) => {
  const { name, lastName } = route.params; 

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UserTabs" 
        component={BottomTab} 
        options={{ 
          header: () => <CustomHeader name={name} lastName={lastName} navigation={navigation}/>,

          headerStyle: { backgroundColor: '#6AC5C8' },
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: '#6AC5C8', height: 100 },
      tabBarLabelStyle: { fontSize: 12 },
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'UserTasks') {
          iconName = 'code-slash-outline';
        } else if (route.name === 'Done Task') {
          iconName = 'checkmark-done-outline';
        } else if (route.name === 'TestedTasks') {
          iconName = 'person-outline';
        } else if (route.name === 'Report') {
          iconName = 'bar-chart-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'black',
    })}
  >
    <Tab.Screen name="UserTasks" component={UserTasksScreen} />
    <Tab.Screen name="Done Task" component={DoneTaskScreen} />
<<<<<<< HEAD
    <Tab.Screen name="TestedTasks" component={TestedTasksScreen} />
    <Tab.Screen name="Report" component={ReportScreen} />
=======
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Report" component={ReportUserScreen} />
>>>>>>> 0415f1e32d8bb0a0899f7f0cca3f9157afe74c06
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

export default UserTabs;

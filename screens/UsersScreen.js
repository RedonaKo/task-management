import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { fetchUsers } from "../util/firebase";

const UserCard = ({ name,tasks, done, navigation, userData }) => (
  <TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate('UserDetails', {user: userData})}
  >
    <View style={styles.container}>
      <Text style={styles.text}>{name[0].toUpperCase()}</Text>
      
    </View>
    <View>
      <Text style={styles.textName}>{name}</Text>
      <Text style={styles.textTaskDone}>Tasks: {tasks}        Done: {done}</Text>
    </View>

  </TouchableOpacity>
);

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  
  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

 
  useEffect(() => {
    loadUsers();
  }, []);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers();
    });
    return unsubscribe;
  }, [navigation]);


  return (
    <View style={styles.view}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserCard 
            name={item.Name} 
            tasks={item.tasks}  
            done={item.done} 
            navigation={navigation}
            userData={item} 
            
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('User')}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  list: {
    paddingBottom: 80,
  },
  card: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    marginTop: 25,
    shadowColor: '#00000026',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1
  },
  container: {
    backgroundColor: '#BD06D9',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold'
  },
  textName: {
    paddingLeft: 15,
    paddingBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textTaskDone: {
    paddingLeft: 15,
    paddingBottom: 12,
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14
  },
  button: {
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#0891B2',
    width: 70,
    height: 70,
    justifyContent: 'center',
    position: 'absolute',
    marginTop: 580,
    marginLeft: 290
  },
  view: {
    backgroundColor: "white"
  }
});

export default UsersScreen;

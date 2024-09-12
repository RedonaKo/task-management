import {  FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import userData from "../data/dummyData";
import { Ionicons} from '@expo/vector-icons'



const UserCard = ({ name, tasks, done,  }) => (
    <View style={styles.card}>
        <View style={styles.contanier}>
            <Text style={styles.text}>AK</Text>
        </View>
        <View>
            <Text style={styles.textName}>{name}</Text>
            <Text style={styles.textTaskDone}>Task: {tasks}        Done: {done}</Text>
        </View>
    </View>
);

const UsersScreen = ({navigation}) => {
  return (
    <View style={styles.view}>
        <FlatList 
        data={userData}
        renderItem={({ item }) => <UserCard name={item.name} tasks={item.name} done={item.done} 
        /> }
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        >
        </FlatList>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('User')} >
          <Ionicons name="add" size={35} color="white"/>
        </TouchableOpacity>
    </View>
  );
}


export default UsersScreen;

const styles = StyleSheet.create({
    list: {
        paddingBottom: 80,
    },
    card: {
        height: 130,
        flexDirection: 'row',
        alignItems : 'center',
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        borderRadius: 20,
        elevation: 3,
        marginTop: 25,
        shadowColor: '#00000026',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity : 1
    },
    contanier: {
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


import { ScrollView, StyleSheet, Text, TextInput, View,Modal, KeyboardAvoidingView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Country, State, City } from "country-state-city";
import { Picker } from '@react-native-picker/picker';
import { registerUser } from "../util/firebase";
import Toast from 'react-native-toast-message'; 
import { useNavigation } from '@react-navigation/native';



const  UserScreen = ({}) => {

const [birthdate, setBirthdate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);

const [showCountryPicker, setShowCountryPicker] = useState(false); 
const [showStatePicker, setShowStatePicker] = useState(false);
const [showCityPicker, setShowCityPicker] = useState(false);


const countryData = Country.getAllCountries();
const [country, setCountry] = useState(countryData[0].isoCode); 
const [state, setState] = useState('');
const [city, setCity] = useState('');

const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);

const [name, setName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

const navigation = useNavigation();


const onDateChange = (event, selectedDate) => {
 setShowDatePicker(false);
 if (selectedDate) {
   setBirthdate(selectedDate);
 } 
};



useEffect(() => {
  const stateData = State.getStatesOfCountry(country);
  setStates(stateData);
  setState('');
  setCity('');
  setCities([]); 
}, [country]);


useEffect(() => {
  if (state) {
    const cityList = City.getCitiesOfState(country, state); 
    setCities(cityList);
    setCity(''); 
  }
}, [state]);





//Validation

const validateInputs = () => {
 const newErrors = {};

 if (!name.trim()) newErrors.name = 'Name is required';
 if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
 if (!email.trim()) newErrors.email = 'Email is required';
 else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is not valid';

 if(!password.trim()) newErrors.password = 'Password is required';
 else if (password.length < 6) newErrors.password = 'Password must be at least 8 characters long'; 

 setErrors(newErrors);

 return Object.keys(newErrors).length === 0;

};

//Handle submit button
const handleSubmitButton = async () => { 

 if (validateInputs()) {
   try {
     const token = await registerUser(email, password, name, lastName, birthdate.toISOString(), country, state, city, null, 'user');
     if (token) {
       Toast.show({
         type: 'success',
         text1: 'Registration Successful!',
         text2: 'User has been registered successfully.'
       });
       console.log('User registered successfully!');
  
     }
   } catch (error) {
     console.error('Error during registration:', error.message);
   }
   finally {
    navigation.goBack('Users');
   }
 }
};



return(

 <ScrollView contentContainerStyle={styles.container} >
     <Text style={styles.text}>Add User</Text>
     <View style={styles.view}>
         <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.textInput} />
         {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
         <TextInput placeholder="Last Name" style={styles.textInput} value={lastName} onChangeText={setLastName} />
         {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

     <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)} >
         <Text style={styles.dateText}> {birthdate.toDateString()} </Text>
       </TouchableOpacity>


         {showDatePicker && (
         <Modal transparent={true} animationType="slide" visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
     <View style={styles.modalContainer}>
       <View style={styles.pickerWrapper}>
          <DateTimePicker value={birthdate} mode="date" display="default"  onChange={onDateChange}  />
        </View>
     </View>
        </Modal>
)}

    <TouchableOpacity style={styles.pickerInput} onPress={() => setShowCountryPicker(true)}>
          <Text style={styles.pickerText}>
            {Country.getCountryByCode(country)?.name || 'Select Country'}
          </Text>
        </TouchableOpacity>
        {showCountryPicker && (
          <Modal transparent={true} animationType="slide" visible={showCountryPicker} onRequestClose={() => setShowCountryPicker(false)}>
            <View style={styles.modalContainer}>
              <Picker selectedValue={country} style={styles.picker} onValueChange={(itemValue) => {
                setCountry(itemValue);
                setShowCountryPicker(false);
              }}>
                {countryData.map((item) => (
                  <Picker.Item key={item.isoCode} label={item.name} value={item.isoCode} />
                ))}
              </Picker>
            </View>
          </Modal>
        )}

        {states.length > 0 && (
         <>
        <TouchableOpacity style={styles.pickerInput} onPress={() => setShowStatePicker(true)}>
          <Text style={styles.pickerText}>
            {state ? State.getStateByCodeAndCountry(state, country)?.name : 'Select State'}
          </Text>
        </TouchableOpacity>
        {showStatePicker && (
          <Modal transparent={true} animationType="slide" visible={showStatePicker} onRequestClose={() => setShowStatePicker(false)}>
            <View style={styles.modalContainer}>
              <Picker selectedValue={state} style={styles.picker} onValueChange={(itemValue) => {
                setState(itemValue);
                setShowStatePicker(false);
              }}>
                {states.map((item) => (
                  <Picker.Item key={item.isoCode} label={item.name} value={item.isoCode} />
                ))}
              </Picker>
            </View>
          </Modal>
           )}
   </>
        )}


{cities.length > 0 && (
  <>
<TouchableOpacity style={styles.pickerInput} onPress={() => setShowCityPicker(true)}>
   <Text style={styles.pickerText}>
     {city ? city : 'Select City'}
   </Text>
</TouchableOpacity>
{showCityPicker && (
   <Modal  transparent={true}  animationType="slide"  visible={showCityPicker} onRequestClose={() => setShowCityPicker(false)}>
     <View style={styles.modalContainer}>
     <Picker selectedValue={city} style={styles.picker} onValueChange={(itemValue) => {
        setCity(itemValue);
        setShowCityPicker(false);
         }}>
           {cities.map((item) => (
            <Picker.Item key={`${item.name}-${item.isoCode}`} label={item.name} value={item.name} />
             ))}
      </Picker>
     </View>
   </Modal>
   )}
   </>
)}

 
 <TextInput placeholder="Email" style={styles.textInput} value={email}  onChangeText={setEmail}></TextInput>
       {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

  <TextInput placeholder="Password" style={styles.textInput} secureTextEntry value={password} onChangeText={setPassword} ></TextInput>
  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
     </View>
     <TouchableOpacity style={styles.submitButton} onPress={handleSubmitButton}>
        <Text style={styles.buttonText}>Add User</Text>
    </TouchableOpacity>

 </ScrollView>
);
}




const styles = StyleSheet.create({
container: {
 flex: 1,
 justifyContent: 'center',
 alignItems: 'center',
 backgroundColor: 'white',
},
text: {
 width: 130,
 height: 30,
 fontSize: 30,
 fontWeight: 'bold',
 marginTop: 50,
 marginBottom: 15

},
view: {
 backgroundColor: '#6AC5C8',
 width: 360,
 height: 600,
 flex: 1,
 borderRadius: 20,

},
textInput: {
 width: '90%',
 height: 45,
 borderColor: '#ddd',
 borderWidth: 1,
 borderRadius: 5,
 backgroundColor: '#fff',
 marginHorizontal: 17,
 marginTop: 25,
 marginBottom: -5
},
dateInput: {
 width: '90%',
 height: 45,
 borderColor: '#ddd',
 borderWidth: 1,
 borderRadius: 5,
 paddingHorizontal: 10,
 justifyContent: 'center',
 marginBottom: -5,
 backgroundColor: '#fff',
 marginTop: 25,
 marginBottom: -5,
 marginHorizontal: 17,

},
dateText: {
 color: 'black',
 fontSize: 16,
 justifyContent: 'center',
 marginHorizontal: 0
},
pickerInput: {
 width: '90%',
 height: 45,
 borderColor: '#ddd',
 borderWidth: 1,
 borderRadius: 5,
 paddingHorizontal: 10,
 justifyContent: 'center',
 marginBottom: 15,
 backgroundColor: '#fff',
 justifyContent: 'center',
 paddingVertical: 10,
 marginHorizontal: 17,
 marginTop: 25,
 marginBottom: -5
},
pickerText: {
 color: 'black',
 fontSize: 16,
 justifyContent: 'center',
 marginHorizontal: 0
},
modalContainer: {
 flex: 1,
 justifyContent: 'center',
 alignItems: 'center',
 backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
pickerWrapper: {
 backgroundColor: '#fff',
 padding: 20,
 borderRadius: 10,
 shadowColor: '#000',
 shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.25,
 shadowRadius: 4,
 elevation: 5, 
},
picker: {
 width: '80%',
 height: 200,
 backgroundColor: '#fff',
},
submitButton: {
 height: 45,
 width: '87%',
 backgroundColor: '#356290',
 paddingVertical: 15,
 paddingHorizontal: 40,
 borderRadius: 5,
 alignItems: 'center',
 marginHorizontal: 17,
 marginTop: 10,
 marginBottom: 25
},
buttonText: {
 color: '#fff',
 fontSize: 18,
 height: 20,
 alignItems: 'center',
 alignContent: 'center',
 marginTop: -5

},
errorText: {
 color: 'red',
 marginTop:  8,
 marginBottom: -20,
 marginLeft: 20
},
});

export default UserScreen;



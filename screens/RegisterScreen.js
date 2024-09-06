import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Country, State, City } from 'country-state-city';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../util/firebase';
import Toast from 'react-native-toast-message'; 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 

const RegisterScreen = () => {
  const countryData = Country.getAllCountries();
  const [country, setCountry] = useState(countryData[0].isoCode);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false); 
  const [showStatePicker, setShowStatePicker] = useState(false); 

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null); 

  useEffect(() => {
    setStates(State.getStatesOfCountry(country));
    setState('');
    setCity('');
  }, [country]);

  useEffect(() => {
    if (state) {
      setCities(City.getCitiesOfState(country, state));
      setCity('');
    }
  }, [state]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    } 
  };

  // Image Picker Handler
  const handleChoosePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        alert('Permission is required to access the camera and gallery');
        return;
      }

      const options = ['Take Photo', 'Choose from Gallery', 'Cancel'];
      const response = await new Promise((resolve) => {
        Alert.alert('Select an Option', '', [
          { text: options[0], onPress: () => resolve('camera') },
          { text: options[1], onPress: () => resolve('gallery') },
          { text: options[2], onPress: () => resolve('cancel') },
        ]);
      });

      if (response === 'cancel') {
        return;
      }

      let result;

      if (response === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else if (response === 'gallery') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        await convertToBase64(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
    }
  };

  // Convert Image to Base64
  const convertToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      setBase64Image(base64);
    } catch (error) {
      console.log('Error converting image to base64:', error.message);
    }
  };

  // Validation
  const validateInputs = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is not valid';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle submit button 
  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        const token = await registerUser(email, password, name, lastName, birthdate.toISOString(), country, city);
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
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <Image source={selectedImage ? { uri: selectedImage } : require('../Image/icon1.png')} style={styles.iconImage} />

      <TouchableOpacity style={styles.chooseImageButton} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>

      <View style={styles.view}>
        <TextInput
          style={styles.inputName}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {birthdate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity
          style={styles.pickerInput}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.pickerText}>
            {Country.getCountryByCode(country).name}
          </Text>
        </TouchableOpacity>
        {showCountryPicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showCountryPicker}
            onRequestClose={() => setShowCountryPicker(false)}
          >
            <View style={styles.modalContainer}>
              <Picker
                selectedValue={country}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setCountry(itemValue);
                  setShowCountryPicker(false);
                }}
              >
                {countryData.map((item) => (
                  <Picker.Item key={item.isoCode} label={item.name} value={item.isoCode} />
                ))}
              </Picker>
            </View>
          </Modal>
        )}

        <TouchableOpacity
          style={styles.pickerInput}
          onPress={() => setShowStatePicker(true)}
        >
          <Text style={styles.pickerText}>
            {State.getStateByCodeAndCountry(state, country)?.name || 'Select State'}
          </Text>
        </TouchableOpacity>
        {showStatePicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showStatePicker}
            onRequestClose={() => setShowStatePicker(false)}
          >
            <View style={styles.modalContainer}>
              <Picker
                selectedValue={state}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setState(itemValue);
                  setShowStatePicker(false);
                }}
              >
                {states.map((item) => (
                  <Picker.Item key={item.isoCode} label={item.name} value={item.isoCode} />
                ))}
              </Picker>
            </View>
          </Modal>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 30,
  },
  iconImage: {
    width: 158,
    height: 180,
    marginBottom: 50,
  },
  chooseImageButton: {
    backgroundColor: '#356290',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputName: {
    marginTop: 30,
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateText: {
    color: 'black',
    fontSize: 16,
  },
  submitButton: {
    height: 50,
    width: '80%',
    backgroundColor: '#356290',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  view: {
    backgroundColor: '#6AC5C8',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pickerInput: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  pickerText: {
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  picker: {
    width: '80%',
    height: 200,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
});

export default RegisterScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Country, State, City } from 'country-state-city';
import { Picker } from '@react-native-picker/picker';

const RegisterScreen = () => {
  const countryData = Country.getAllCountries();
  const [country, setCountry] = useState(countryData[0].isoCode);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [states, setStates] = useState([]);

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
  const handleSubmit = () => {
    if (validateInputs()) {
      
      console.log('Form submitted successfully!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Image/icon1.png')} style={styles.iconImage} />

      <TouchableOpacity style={styles.chooseImageButton}>
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
            {State.getStateByCodeAndCountry(state, country)?.name || 'Select state'}
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

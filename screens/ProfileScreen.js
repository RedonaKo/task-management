import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Linking 
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import {AuthContext} from '../context/authContext'; 
import * as FileSystem from 'expo-file-system';
import {changeImagefunction, firebase, registerUser} from '../util/firebase';

function ProfileScreen() {
    const { userName, userLastName, userBirthdate } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);

    
    const handleChoosePhoto = async () => {
        try {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'This app needs camera and gallery permissions to function properly.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
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
                    base64:true
                });
            } else if (response === 'gallery') {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                    base64:true
                });
            }

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                setBase64Image(result.assets[0].base64);
            }
        } catch (error) {
            console.error('Error picking image:', error.message);
        }
    };
    
    const displayBirthdate = userBirthdate
        ? new Date(userBirthdate).toLocaleDateString()
        : 'Not provided';

    
    const handleSaveProfile = async () => {
        if(base64Image){
            try{
                await changeImagefunction(
                    base64Image, 
                );
                Alert.alert('Profile Updated', 'Your profile picture has been saved');
            }catch (error){
                console.error('Error saving profile:', error.message);
            }
        }else{
            Alert.alert('No image', 'Please select an image first');
        }
        console.log('Image changed:' , base64Image);
    };
    
    return (
        <>
            <View style={styles.container}>
                {selectedImage ? (
                    <Image 
                        style={styles.imageProfile} 
                        source={{uri: selectedImage}} 
                    />
                ) : (
                    <Text style={styles.txtProfile}>Profile Picture</Text>
                )}
            </View>
            <View style={styles.photoDetails}>
                <TouchableOpacity style={styles.editTxt} onPress={handleChoosePhoto}>
                    <Text>Change Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editTxt2} onPress={handleSaveProfile}>
                    <Text>Save Photo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardPersonal}>
                <Text style={styles.txtPersonal}>First Name: {userName}</Text>
                <Text style={styles.txtPersonal}>Last Name: {userLastName}</Text>
                <Text style={styles.txtPersonal}>Birthdate: {displayBirthdate}</Text>
            </View>
        </>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9D9D9',
        height: 135,
        width: 180,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 116,
        borderRadius: 4
    },
  
    cardPersonal: {
        backgroundColor: '#6AC5C8',
        height: 400,
        marginTop: 4,
        marginBottom: 40,
        marginLeft: 40,
        marginRight: 40,
        borderRadius: 26,
        PADDING:20,
    },
    txtPersonal: {
        paddingLeft: 10,
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    txtProfile: {
        fontWeight: 'bold',
        fontSize: 16
    }, 
    imageProfile: {
        height: 135,
        width: 180,
        borderRadius:4,
    },
    photoDetails:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:70,
        marginRight:70,
    },
    editTxt:{
        backgroundColor:'#fff',
        width:110,
        textAlign:'center',
        marginTop:10,
        padding:5,
        borderRadius:5,
        marginBottom:10
    },
    editTxt2:{
        backgroundColor:'#fff',
        width:110,
        textAlign:'center',
        marginTop:10,
        padding:5,
        borderRadius:5,
        marginBottom:10
    }
});

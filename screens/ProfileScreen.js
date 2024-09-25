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
import { AuthContext } from '../context/authContext'; 
import { changeImagefunction, fetchUserDetails } from '../util/firebase';

function ProfileScreen() {
    const { userId, userName, userLastName, userBirthdate, token } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (userId) {
                try {
                    const userData = await fetchUserDetails(userId);
                    console.log('Fetched User Data:', userData);
                    if (userData && userData.Image) {
                        setSelectedImage(`data:image/jpeg;base64,${userData.Image}`);
                    }
                } catch (error) {
                    console.error('Error fetching profile image:', error.message);
                }
            }
        };

        fetchProfileImage();
    }, [userId]);

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
                    quality: 0.7,
                    base64: true,
                    base64: true
                });
            } else if (response === 'gallery') {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                    base64: true
                });
            }

            if (!result.canceled) { 
                const uri = result.assets[0].uri;
                const base64 = result.assets[0].base64;
                console.log('Selected Image URI:', uri);
                console.log('Selected Image Base64:', base64); 
                
                setSelectedImage(uri);
                setBase64Image(base64);
            }
        } catch (error) {
            console.error('Error picking image:', error.message);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };
    
    const displayBirthdate = userBirthdate
        ? new Date(userBirthdate).toLocaleDateString()
        : 'Not provided';

    const handleSaveProfile = async () => {
        if (base64Image) {
            try {
                await changeImagefunction(userId, base64Image);
                setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
                Alert.alert('Success', 'Your profile picture has been updated.');
            } catch (error) {
                console.error('Error saving profile:', error.message);
                Alert.alert('Error', 'Failed to save profile picture. Please try again.')
            }
        } else {
            Alert.alert('No Image', 'Please select an image first.');
        }
     };  
    
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {selectedImage ? (
                    <Image 
                        style={styles.imageProfile} 
                        source={{ uri: selectedImage }} 
                    />
                ) : (
                    <Text style={styles.txtProfile}>Profile Picture</Text>
                )}
            </View>
            <View style={styles.photoDetails}>
                <TouchableOpacity style={styles.editBtn} onPress={handleChoosePhoto}>
                    <Text style={styles.editText}>Change Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                    <Text style={styles.saveText}>Save Photo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardPersonal}>
                <Text style={styles.txtPersonal}>First Name: {userName}</Text>
                <Text style={styles.txtPersonal}>Last Name: {userLastName}</Text>
                <Text style={styles.txtPersonal}>Birthdate: {displayBirthdate}</Text>
            </View>
        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageContainer: {
        backgroundColor: '#D9D9D9',
        height: 135,
        width: 220,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 4
    },
    cardPersonal: {
        backgroundColor: '#6AC5C8',
        flex: 1,
        marginTop: 20,
        marginHorizontal: 40,
        borderRadius: 26,
        padding: 20,
        marginBottom:20
    },
    txtPersonal: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 20,
    },
    txtProfile: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#555',
    }, 
    imageProfile: {
        height: 135,
        width: 180,
        borderRadius: 4,
    },
    photoDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginHorizontal: 40,
    },
    editBtn: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    saveBtn: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    editText: {
        color: '#000',
    },
    saveText: {
        color: '#000',
    }
});

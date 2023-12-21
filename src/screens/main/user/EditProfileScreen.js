import "core-js/stable/atob";
import * as React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function EditProfileScreen({ navigation }) {
    const { signOut, token } = useAuth();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const user_id = jwtDecode(token).userId;
                const response = await axios.get(`http://10.0.2.2:3000/users/${user_id}`);
                const user = response.data;
                //console.log(user);
                setUser(user.user);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setPhoneNumber(user.phoneNumber);
            setHouseNumber(user.houseNumber);
            setStreet(user.street);
            setCity(user.city);
        }
    }
        , [user]);

    const updateUserInfo = async () => {
        try {
            const user_id = jwtDecode(token).userId;
            console.log(user_id);
            const response = await axios.put(`http://10.0.2.2:3000/users/${user_id}`, {
                email: email,
                firstname: firstName,
                lastname: lastName,
                city: city,
                street: street,
                number: houseNumber,
                phone: phoneNumber,
            });
            const user = response.data.user;
            setUser(user);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleEditName = () => {
        if (firstName === '' || lastName === '' || email === '') {
            Alert.alert('Thông báo', 'Tên không được để trống.');
            return;
        };
        updateUserInfo();
        Alert.alert('Thông báo', 'Hồ sơ người dùng đã được thay đổi.');
        navigation.navigate('ProfileScreen');
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageHeader}>
                <Image
                    style={styles.image}
                    source={require('../../../../assets/profile.jpg')}
                />
                <TouchableOpacity style={styles.editButton} onPress={handleEditName}>
                    <Ionicons name="checkmark-outline" size={24} color="green" />
                </TouchableOpacity>
            </View>
            <View style={styles.editName}>
                <View style={styles.firstNameContainer}>
                    <Text style={styles.titleText}>First name</Text>
                    <TextInput
                        style={styles.firstName}
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
                <View style={styles.lastNameContainer}>
                    <Text style={styles.titleText}>Last name</Text>
                    <TextInput
                        style={styles.lastName}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
            </View>
            <View style={styles.email}>
                <Text style={styles.titleText}>Email</Text>
                <TextInput
                    style={styles.infoText}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.phoneNumber}>
                <Text style={styles.titleText}>Phone number</Text>
                <TextInput
                    style={styles.infoText}
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>
            <View style={styles.houseNumber}>
                <Text style={styles.titleText}>House number</Text>
                <Text style={styles.infoText}>{houseNumber}</Text>
            </View>
            <View style={styles.street}>
                <Text style={styles.titleText}>Street</Text>
                <TextInput
                    style={styles.infoText}
                    placeholder="Street"
                    value={street}
                    onChangeText={setStreet}
                />
            </View>
            <View style={styles.city}>
                <Text style={styles.titleText}>City</Text>
                <TextInput
                    style={styles.infoText}
                    placeholder={city}
                    value={city}
                    onChangeText={setCity}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    imageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 80,
        resizeMode: 'contain',
    },
    firstName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    lastName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    editButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
    },
    info: {
        marginTop: 16,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    editName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    phoneNumber: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    houseNumber: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    street: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    city: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    firstNameContainer: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
    },
    lastNameContainer: {
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
    },
});
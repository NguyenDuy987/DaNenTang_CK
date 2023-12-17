import "core-js/stable/atob";
import * as React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
    const { signOut, token } = useAuth();
    const [user, setUser] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    //20520469_NguyenDucDuy
    useEffect(() => {
        const user_id = jwtDecode(token).userId;
        console.log(user_id);
        const getUser = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/users/${user_id}`);
                const user = response.data;
                setUser(user);
                console.log(user);
                setFirstName(user.firstname);
                setLastName(user.lastname);
                setEmail(user.email);
                setPhoneNumber(user.phoneNumber);
                setHouseNumber(user.houseNumber);
                setStreet(user.street);
                setCity(user.city);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getUser();
    }, []);

    const handleLogout = () => {
        signOut();
    };

    const handleEdit = () => {
        navigation.navigate('EditProfile');
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Profile Screen</Text>
            <View style={styles.container}>
                <View style={styles.imageHeader}>
                    <Image
                        style={styles.image}
                        source={require('../../../../assets/profile.jpg')}
                    />
                    <Text style={styles.name}>{firstName} {lastName}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                        <Ionicons name="create-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoText}>Email: {email}</Text>
                    <Text style={styles.infoText}>Phone number: {phoneNumber}</Text>
                    <Text style={styles.infoText}>Address: {houseNumber} {street}, {city}</Text>
                </View>
                <Button title="Log out" onPress={handleLogout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    imageHeader: {
        alignItems: 'left',
        justifyContent: 'center',
        marginBottom: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 80,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    editButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    info: {
        marginBottom: 16,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

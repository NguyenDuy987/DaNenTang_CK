import "core-js/stable/atob";
import { useAuth } from '../../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import axios from 'axios';
import { FavItem } from './FavItem';
import { jwtDecode } from 'jwt-decode';
const { token } = useAuth();

const FavList = ({ bookListType, navigation }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = jwtDecode(token).userId;
                const response = await axios.get(`http://10.0.2.2:3000/favorites/${userId}`);
                const filteredBooks = response.data.items;
                setBooks(filteredBooks || []);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }
        , [bookListType]);

    return (
        <View>
            <FlatList
                data={books}
                renderItem={({ item }) => <FavItem book={item} navigation={navigation} />}
                keyExtractor={item => item.id}
                horizontal={false}
            />
        </View>
    );
}

export default FavList;

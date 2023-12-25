import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import axios from 'axios';
import { BookItem } from '../books/BookItem';

export const BookList = ({ bookListType, navigation }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookListType}&maxResults=40&country=US`);
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
                renderItem={({ item }) => <BookItem book={item} navigation={navigation} />}
                keyExtractor={item => item.id}
                horizontal={true}
            />
        </View>
    );
}

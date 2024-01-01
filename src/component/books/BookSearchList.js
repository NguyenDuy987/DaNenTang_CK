import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { BookItem } from '../books/BookItem';

const BookSearchList = ({ route, navigation }) => {
    const [books, setBooks] = useState([]);
    const [resultText, setResultText] = useState(route.params.searchText);

    if (resultText === '') {
        return (
            <View style={styles.container}>
                <Text>Enter something to search</Text>
            </View>
        );
    }

    //The header title is the search text
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: resultText });
    }, [navigation, resultText]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${resultText}&maxResults=40&country=US`);
                console.log(response.data.items);
                const filteredBooks = response.data.items;
                setBooks(filteredBooks || []);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }
    , [resultText]);

    return (
        <View style={styles.container}>
            <View style={styles.flatListContainer}>
                <View>
                    <Text style={styles.itemCountText}>
                        {books.length} results found
                    </Text>
                </View>
                <FlatList
                    data={books}
                    renderItem={({ item }) => <BookItem book={item} navigation={navigation} />}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    horizontal={false}
                    />
            </View>
        </View>
    );
}

export default BookSearchList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    itemCountText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    searchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import axios from 'axios';
import { Products } from './Products';
import { BookItem } from '../books/BookItem';

export const ProductList = ({ productListType, navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl = '';
                let whatCase;

                switch (productListType) {
                    case 'Allproducts':
                        apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=country=US&saleInfo.saleability=FOR_SALE';
                        break;
                    case 'HotDeals':
                        apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=java&maxResults=40&country=US';
                        whatCase = "Hot";
                        break;
                    case 'NewArrivals':
                        apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=react&maxResults=40&country=US&saleInfo.saleability=FOR_SALE';
                        whatCase = "new";
                        break;
                    default:
                        apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${productListType}`;
                        break;
                }

                const response = await axios.get(apiUrl);
                const filteredBooks = response.data.items;
                setProducts(filteredBooks || []);
                //setProducts(response.data.items || []);
                console.log("số lượng ban đầu của " + whatCase + response.data.items.length);
                console.log(filteredBooks.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [productListType]);

    return (
        <View>
            <FlatList
                data={products}
                renderItem={({ item }) => <BookItem book={item} navigation={navigation} />}
                keyExtractor={item => item.id}
                numColumns={2}
            />
        </View>
    );
}
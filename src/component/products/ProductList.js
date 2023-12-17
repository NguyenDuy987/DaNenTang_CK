import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import axios from 'axios';
import { Products } from './Products';

export const ProductList = ({ productListType, navigation }) => {
    const [products, setProducts] = useState([]);

    const hasCompleteData = (book) => {
        return (
            book.volumeInfo &&
            book.volumeInfo.title &&
            book.volumeInfo.imageLinks &&
            book.volumeInfo.imageLinks.thumbnail &&
            book.saleInfo &&
            book.saleInfo.listPrice &&
            book.saleInfo.listPrice.amount &&
            book.volumeInfo.averageRating &&
            book.volumeInfo.ratingsCount
        );
    };

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
                        apiUrl = await 'https://www.googleapis.com/books/v1/volumes?q=java&maxResults=40&country=US';
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
                const filteredBooks = response.data.items ? response.data.items.filter(hasCompleteData) : [];
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
                renderItem={({ item }) => <Products item={item} navigation={navigation} />}
                keyExtractor={item => item.id}
                numColumns={2}
            />
        </View>
    );
}
import "core-js/stable/atob";
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { jwtDecode } from 'jwt-decode';


export const BookItem = ({ book, navigation }) => {
    const { state, dispatch } = useCart();
    const { cart } = useCart();
    const { token } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [reload, setReload] = useState(false);
    const { fetchCartFromAPI } = useCart();

    useEffect(() => {
        if (reload) {
            fetchCartFromAPI();
            console.log("Đã reload");
            setReload(false);
        }

    }, [reload]);

    const handleProductDetail = () => {
        navigation.navigate('BookDetail', { Id: book.id , title: book.volumeInfo.title, image: book.volumeInfo.imageLinks.thumbnail, price: book.saleInfo && book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : 'N/A', description: book.volumeInfo.description, authors: book.volumeInfo.authors, categories:book.volumeInfo.categories , rate: book.volumeInfo.averageRating ? book.volumeInfo.averageRating.toFixed(1) : 'N/A', count: book.volumeInfo.ratingsCount ? book.volumeInfo.ratingsCount : 'N/A' });
    }

    const handleAddToCart = async () => {
        // Check if the product with the given ID already exists in the cart
        const existingCart = state.cartItems[0];


        if (existingCart) {
            const existingItem = existingCart.products.find((cartItem) => cartItem.productId === book.id);

            if (existingItem) {
                Alert.alert('The product is already in the cart!');
                return;
            }
        }

        try {
            userId = jwtDecode(token).userId;
            console.log(userId);
            const response = await axios.post(`http://10.0.2.2:3000/carts/${userId}/add`, {
                productId: book.id,
                productTitle: book.volumeInfo.title,
                productImage: book.volumeInfo.imageLinks.thumbnail,
                price: getPrice(book.saleInfo),
                quantity: 1,
            });

            //dispatch({ type: 'ADD_TO_CART', payload: item });
            setReload(true);
            console.log('Thêm sản phẩm ' + book.id);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            Alert.alert('Error adding product to cart. Please try again.');
        }
    };


    const getPrice = (saleInfo) => {
        if (saleInfo && saleInfo.listPrice && saleInfo.listPrice.amount) {
            return `${saleInfo.listPrice.amount.toFixed(2)}`;
        } else if (saleInfo && saleInfo.retailPrice && saleInfo.retailPrice.amount) {
            return `${saleInfo.retailPrice.amount.toFixed(2)}`;
        } else {
            return '100';
        }
    };

    const getAuthors = (authors) => {
        // if authors array > 1, return the first author name and plus 'et al.'
        if (authors && authors.length > 1) {
            return `${authors[0]} ...`;
        } else if (authors) {
            return `${authors[0]}`;
        } else {
            return 'N/A';
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleProductDetail}>
                <View style={styles.imageContainer}>
                    <View style={styles.imageSizeContainer}>
                        <Image source={{ uri: book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
                        <Text style={styles.title}>{book.volumeInfo.title}</Text>
                    </View>
                    <View style={styles.infoSizeContainer}>
                        <Text style={styles.infoTitle}>Authors: {getAuthors(book.volumeInfo.authors)}</Text>
                        <Text style={styles.infoTitle}>Categories: {book.volumeInfo.categories}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.noteContainer}>
                <View style={styles.note}>
                    <Text style={styles.price}>$ {getPrice(book.saleInfo)}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{book.volumeInfo.averageRating ? book.volumeInfo.averageRating.toFixed(1) : 'N/A'} </Text>
                        <Ionicons name="star" size={16} color="yellow" />
                        <Text style={styles.ratingText}>({book.volumeInfo.ratingsCount ? book.volumeInfo.ratingsCount : 'N/A'})</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleAddToCart}>
                    <View style={styles.addCartContainer}>
                        <Ionicons name="add-circle" size={24} color="green" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 5,
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        width: 160,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
    },
    infoTitle: {
        fontSize: 12,
        textAlign: 'left',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
    },
    imageSizeContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    infoSizeContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
        height: 75,
    },
    noteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    note: {
        flexDirection: 'column',
        alignItems: 'left',
    },
    price: {
        fontSize: 16,
        color: 'red',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

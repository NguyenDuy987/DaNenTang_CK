import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { jwtDecode } from 'jwt-decode';
//20520469_NguyenDucDuy
export const Products = ({ item, navigation }) => {
    const { state, dispatch } = useCart();
    const { cart, fetchCartFromAPI } = useCart();
    const { price, setPrice } = useState();
    const { token } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const handleProductDetail = () => {
        navigation.navigate('ProductDetail', { title: item.volumeInfo.title, image: item.volumeInfo.imageLinks.thumbnail, price: item.saleInfo && item.saleInfo.listPrice ? item.saleInfo.listPrice.amount : 'N/A', description: item.volumeInfo.description, rate: item.volumeInfo.averageRating ? item.volumeInfo.averageRating.toFixed(1) : 'N/A', count: item.volumeInfo.ratingsCount ? item.volumeInfo.ratingsCount : 'N/A' });
    }

    const handleAddToCart = async () => {
        // Check if the product with the given ID already exists in the cart
        const existingCart = state.cartItems[0];


        if (existingCart) {
            const existingItem = existingCart.products.find((cartItem) => cartItem.productId === item.id);

            if (existingItem) {
                Alert.alert('The product is already in the cart!');
                return;
            }
        }

        try {
            userId = jwtDecode(token).userId;
            console.log(userId);
            const response = await axios.post(`http://10.0.2.2:3000/carts/${userId}/add`, {
                productId: item.id,
                productTitle: item.volumeInfo.title,
                productImage: item.volumeInfo.imageLinks.thumbnail,
                price: getPrice(item.saleInfo),
                quantity: 1,
            });

            //dispatch({ type: 'ADD_TO_CART', payload: item });
            fetchCartFromAPI();
            console.log('Thêm sản phẩm ' + item.id);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            Alert.alert('Error adding product to cart. Please try again.');
        }
    };

    const getPrice = (saleInfo) => {
        if (saleInfo && saleInfo.listPrice && saleInfo.listPrice.amount) {
            return saleInfo.listPrice.amount.toFixed(2);
        } else if (saleInfo && saleInfo.retailPrice && saleInfo.retailPrice.amount) {
            return saleInfo.retailPrice.amount.toFixed(2);
        } else {
            return 100;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleProductDetail}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
                    <Text style={styles.title}>{item.volumeInfo.title}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.noteContainer}>
                <View style={styles.note}>
                    <Text style={styles.price}>$ {getPrice(item.saleInfo).toString()}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{item.volumeInfo.averageRating ? item.volumeInfo.averageRating.toFixed(1) : 'N/A'} </Text>
                        <Ionicons name="star" size={16} color="yellow" />
                        <Text style={styles.ratingText}>({item.volumeInfo.ratingsCount ? item.volumeInfo.ratingsCount : 'N/A'})</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleAddToCart}>
                    <View style={styles.addCartContainer}>
                        <Ionicons name="add-circle" size={24} color="blue" />
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
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
        height: 200,
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

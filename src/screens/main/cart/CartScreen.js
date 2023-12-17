//20520469_NguyenDucDuy
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const navigation = useNavigation();
    const { state, dispatch } = useCart();
    const { catt, total } = state;
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productDetails, setProductDetails] = useState({});
    const { token } = useAuth();
    const user_id = jwtDecode(token).sub;
    if (state.cartItems.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Your cart is empty</Text>
                <Button title="Go Shopping" onPress={() => navigation.navigate('HomeScreen')} />
            </View>
        );
    }

    const calculateTotalPrice = (items) => {
        // need round to 2 decimal places
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total.toFixed(2));
    };

    const removeFromCart = async () => {
        try {
            // Send a request to update the API using Axios
            await axios.put(`https://fakestoreapi.com/carts/${user_id}`, {
                userId: user_id,
                products: state.cartItems.filter((cartItem) => cartItem.productId !== item.productId),
            });

            // Dispatch the action to remove item from the cart
            dispatch({ type: 'REMOVE_FROM_CART', payload: item });
            setModalVisible(false);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const increaseQuantity = async (item) => {
        try {
            // Send a request to update the API using Axios
            await axios.put(`https://fakestoreapi.com/carts/${user_id}`, {
                userId: user_id,
                products: state.cartItems.map((cartItem) =>
                    cartItem.productId === item.productId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                ),
            });

            // Dispatch the action to update item quantity in the cart
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: item.productId, quantity: item.quantity + 1 },
            });
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const decreaseQuantity = async (item) => {
        try {
            if (item.quantity > 1) {
                // Send a request to update the API using Axios
                await axios.put(`https://fakestoreapi.com/carts/${user_id}`, {
                    userId: user_id,
                    products: state.cartItems.map((cartItem) =>
                        cartItem.productId === item.productId
                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                            : cartItem
                    ),
                });
                //20520469_NguyenDucDuy
                // Dispatch the action to update item quantity in the cart
                dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.productId, quantity: item.quantity - 1 },
                });
            } else {
                // Show confirmation modal for removing item
                setSelectedItem(item);
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    useEffect(() => {
        calculateTotalPrice(state.cartItems);
    }, [state.cartItems, productDetails]);

    return (
        <View style={styles.container}>
            <FlatList
                data={state.cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                            <Button title="-" onPress={() => decreaseQuantity(item)} />
                            <Text style={styles.quantity}>{item.quantity}</Text>
                            <Button title="+" onPress={() => increaseQuantity(item)} />
                        </View>
                        <Text style={styles.total}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                )}
            />
            <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
            <Button title="Checkout" onPress={() => console.log('Implement checkout logic')} />

            {/* Modal for confirmation */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to remove this item?</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={removeFromCart}>
                        <Text style={styles.modalButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalButtonText}>No</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 14,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 8,
    },
    total: {
        fontSize: 14,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 16,
    },
    modalButton: {
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 8,
        marginVertical: 8,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CartScreen;


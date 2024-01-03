//20520469_NguyenDucDuy
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const navigation = useNavigation();
    const { state, dispatch, fetchCartFromAPI } = useCart();
    const { catt, total } = state;
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productDetails, setProductDetails] = useState({});
    const { token, user } = useAuth();
    const [reload, setReload] = useState(false);
    const [clearCartModalVisible, setClearCartModalVisible] = useState(false);

    const user_id = token ? jwtDecode(token).userId : null;

    useEffect(() => {
        if (reload) {
            fetchCartFromAPI();
            console.log("Đã reload");
            setReload(false);

        }
        if (state.cartItems.length > 0) {

            calculateTotalPrice(state.cartItems[0].products);
        }


    }, [state.cartItems, productDetails, token, reload]);
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: 'Cart' });
    }, [navigation]);

    if (state.cartItems.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Your cart is empty</Text>
                <Button title="Go Shopping" onPress={() => navigation.navigate('HomeScreen')} />
            </View>
        );
    }

    const orderNav = () => {
        navigation.navigate('Order');
    }

    const calculateTotalPrice = (items) => {
        // need round to 2 decimal places
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total.toFixed(2));
    };

    const handleDeleteCart = async () => {
        try {
            const userId = token ? jwtDecode(token).userId : null;
            const result = await axios.delete(`http://10.0.2.2:3000/carts/${userId}`);
            //console.log(result);
            setReload(true);
            //fetchCartFromAPI();
            // Xử lý kết quả nếu cần thiết
            Alert.alert('Your order is underway');
        } catch (error) {
            console.error('Error deleting cart:', error);
            Alert.alert('Error deleting cart. Please try again.');
        }
    };

    const removeFromCart = async (item) => {
        try {
            const userId = token ? jwtDecode(token).userId : null;
            productId = item.productId;
            // Send a request to update the API using Axios
            await axios.delete(`http://10.0.2.2:3000/carts/${userId}/${productId}`)

            setReload(true);
            // Dispatch the action to remove item from the cart
            //dispatch({ type: 'REMOVE_FROM_CART', payload: item });
            //fetchCartFromAPI();
            setModalVisible(false);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const increaseQuantity = async (item) => {
        try {
            const userId = jwtDecode(token).userId;

            // Gọi API để tăng số lượng sản phẩm
            console.log("productID " + item.productId)
            const response = await axios.put(`http://10.0.2.2:3000/carts/${userId}/increase`, {
                productId: item.productId,
            });
            //fetchCartFromAPI();
            setReload(true);
            // Dispatch action để cập nhật state của ứng dụng
            /*
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: item.productId, quantity: item.quantity + 1 },
            });
            */
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    }

    const decreaseQuantity = async (item) => {
        try {
            if (item.quantity > 1) {
                const userId = jwtDecode(token).userId;

                // Gọi API để tăng số lượng sản phẩm
                console.log("productID " + item.productId)
                const response = await axios.put(`http://10.0.2.2:3000/carts/${userId}/decrease`, {
                    productId: item.productId,
                });
                //fetchCartFromAPI();
                setReload(true);
                // Dispatch action để cập nhật state của ứng dụng
                /*
                dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.productId, quantity: item.quantity + 1 },
                });
                */
            } else {
                // Show confirmation modal for removing item
                setSelectedItem(item);
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const getPrice = (saleInfo) => {
        if (saleInfo && saleInfo.listPrice && saleInfo.listPrice.amount) {
            return `$${saleInfo.listPrice.amount.toFixed(2)}`;
        } else if (saleInfo && saleInfo.retailPrice && saleInfo.retailPrice.amount) {
            return `$${saleInfo.retailPrice.amount.toFixed(2)}`;
        } else {
            return '100';
        }
    };

    const handleClearCart = () => {
        // Hiển thị modal xác nhận hoặc thực hiện logic xóa giỏ hàng trực tiếp ở đây
        setClearCartModalVisible(true);
    }



    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.clearCartButton} onPress={handleClearCart}>
                <Text style={styles.clearCartButtonText}>Clear Cart</Text>
            </TouchableOpacity>
            <FlatList
                data={state.cartItems.length > 0 ? state.cartItems[0].products : []}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.productImage }} style={styles.image} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title}>{item.productTitle}</Text>
                            <Text style={styles.price}>{item.price}</Text>
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
            <Button title="Checkout" onPress={() => orderNav()} />

            {/* Modal for confirmation */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to remove this item?</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={() => removeFromCart(selectedItem)}>
                        <Text style={styles.modalButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalButtonText}>No</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal xác nhận xóa giỏ hàng */}
            <Modal visible={clearCartModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to clear the cart?</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={handleDeleteCart}>
                        <Text style={styles.modalButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setClearCartModalVisible(false)}>
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
        backgroundColor: 'green',
        borderRadius: 8,
        marginVertical: 8,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    clearCartButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 8,
        marginTop: 16,
        alignSelf: 'flex-end', // Đặt nút ở phía dưới bên phải
    },
    clearCartButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CartScreen;


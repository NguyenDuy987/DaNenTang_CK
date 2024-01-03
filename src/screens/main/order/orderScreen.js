import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, Image, StyleSheet, Alert, TextInput } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
    const navigation = useNavigation();
    const { state, dispatch, fetchCartFromAPI } = useCart();
    const { catt, total } = state;
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productDetails, setProductDetails] = useState({});
    const { token } = useAuth();
    const [reload, setReload] = useState(false);
    const [customAddress, setCustomAddress] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');

    const [customHouseNumber, setCustomHouseNumber] = useState('');
    const [customStreet, setCustomStreet] = useState('');
    const [customCity, setCustomCity] = useState('');

    const [user, setUser] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('default');
    const [error, setError] = useState('');
    const [isDefaultAddressOpen, setIsDefaultAddressOpen] = useState(true);

    const user_id = token ? jwtDecode(token).userId : null;
    useEffect(() => {
        const getUser = async (user_id) => {
            try {
                response = await axios.get(`http://10.0.2.2:3000/users/${user_id}`);
                setUser(response.data);
            }
            catch (error) {
                console.log(error);
            }

        }
        getUser(user_id);

        if (reload) {
            fetchCartFromAPI();
            console.log("Đã reload");
            setReload(false);

        }
        if (state.cartItems.length > 0) {

            calculateTotalPrice(state.cartItems[0].products);
        }
    }, [state.cartItems, productDetails, token, reload]);

    useEffect(() => {
        // Mã lệnh sẽ chạy khi giá trị user thay đổi

        if (user) {
            //console.log(user);
            setHouseNumber(user.user.houseNumber);
            setStreet(user.user.street);
            setCity(user.user.city);
        }
    }, [user])

    const handleDeleteCart = async () => {
        try {
            const userId = token ? jwtDecode(token).userId : null;
            const result = await axios.delete(`http://10.0.2.2:3000/carts/${userId}`);
            //console.log(result);
            setReload(true);
            //fetchCartFromAPI();
            // Xử lý kết quả nếu cần thiết
            //Alert.alert('Your order is underway');
        } catch (error) {
            console.error('Error deleting cart:', error);
            Alert.alert('Error deleting cart. Please try again.');
        }
    };

    const handleCheckout = async () => {
        try {
            if (selectedAddress === 'custom') {
                // Kiểm tra xem các trường của địa chỉ tùy chỉnh có được điền đầy đủ hay không
                if (!customHouseNumber || !customStreet || !customCity) {
                    Alert.alert('Error', 'Please fill in all fields for custom address.');
                    return;
                }
            }
            // Chuẩn bị dữ liệu đơn hàng
            const orderData = {
                userId: user_id,
                deliveryAddress: selectedAddress === 'default'
                    ? {
                        houseNumber: houseNumber,
                        street: street,
                        city: city,
                    }
                    : {
                        houseNumber: customHouseNumber,
                        street: customStreet,
                        city: customCity,
                    },
                products: state.cartItems[0].products,
                TotalPrice: totalPrice,
            };

            // Gọi API để lưu đơn hàng vào cơ sở dữ liệu
            const response = await axios.post('http://10.0.2.2:3000/orders', orderData);

            // Kiểm tra nếu đơn hàng đã được lưu thành công
            if (response.data.success) {
                // Hiển thị thông báo thành công và chuyển người dùng đến màn hình đơn hàng
                Alert.alert('Success', 'Order placed successfully.');
                handleDeleteCart();
                navigation.navigate('CartScreen');
            } else {
                console.log(response.data);
                // Hiển thị thông báo lỗi nếu có vấn đề xảy ra
                Alert.alert('Error', 'Failed to place the order. Please try again.');
            }
        } catch (error) {
            // Xử lý lỗi nếu có vấn đề trong quá trình gọi API
            console.error('Error during checkout:', error);
            Alert.alert('Error', 'Failed to place the order. Please try again.');
        }
    };
    const toggleDefaultAddress = () => {
        setIsDefaultAddressOpen(!isDefaultAddressOpen);
    };

    const handleAddressChange = (address) => {
        // Thay đổi địa chỉ khi người dùng chọn
        setSelectedAddress(address);

        // Tự đóng khung khi chọn một địa chỉ mới
        setIsDefaultAddressOpen(false);
    }
    const calculateTotalPrice = (items) => {
        // need round to 2 decimal places
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total.toFixed(2));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order sumary </Text>
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
                        <Text style={styles.total}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                )}
            />

            <Text style={styles.title}>Delivery address</Text>
            <TouchableOpacity
                onPress={() => handleAddressChange('default')}
                style={[styles.addressContainer, selectedAddress === 'default' && styles.selectedAddress]}
            >
                <Text style={styles.label}>Default Address:</Text>
                <Text style={styles.addressText}>House number: {houseNumber}</Text>
                <Text style={styles.addressText}>Street: {street}</Text>
                <Text style={styles.addressText}>City: {city}</Text>
            </TouchableOpacity>

            {/* Địa chỉ do người dùng tự nhập */}
            <TouchableOpacity
                onPress={() => handleAddressChange('custom')}
                style={[styles.addressContainer, selectedAddress === 'custom' && styles.selectedAddress]}
            >
                <Text style={styles.label}>Custom Address:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House Number"
                    value={customHouseNumber}
                    onChangeText={(text) => setCustomHouseNumber(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Street"
                    value={customStreet}
                    onChangeText={(text) => setCustomStreet(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={customCity}
                    onChangeText={(text) => setCustomCity(text)}
                />
            </TouchableOpacity>
            <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
            <Button title="Confirm" onPress={() => handleCheckout()} />
        </View>
    );


}
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
        fontSize: 20,
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
    addressContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    addressText: {
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
    },
    addressContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    selectedAddress: {
        borderColor: 'green', // Màu sẽ thay đổi khi được chọn
    },
});
export default OrderScreen;
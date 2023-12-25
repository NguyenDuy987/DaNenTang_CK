// ListOrderScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ListOrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const { token } = useAuth();
    const user_id = token ? jwtDecode(token).userId : null;

    useEffect(() => {
        // Gọi API để lấy danh sách đơn hàng từ máy chủ
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/orders/user/${user_id}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>List of Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text>Order ID: {item._id}</Text>
                        <Text>Total Price: ${item.totalPrice.toFixed(2)}</Text>
                        <Text>Status: {item.status}</Text>
                        {/* Thêm các trường khác bạn muốn hiển thị */}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 16,
        marginBottom: 16,
    },
});

export default ListOrderScreen;

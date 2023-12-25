// OrderDetailScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrderDetailScreen = ({ route }) => {
    const { order } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Details</Text>
            <Text>Order ID: {order._id}</Text>
            <Text>Total Price: ${order.TotalPrice.toFixed(2)}</Text>
            <Text>Status: {order.status}</Text>

            {/* Hiển thị danh sách sản phẩm */}
            <FlatList
                data={order.products}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text>Product: {item.productTitle}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                        <Text>Price: ${item.price.toFixed(2)}</Text>
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
    productItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 16,
        marginBottom: 16,
    },
});

export default OrderDetailScreen;

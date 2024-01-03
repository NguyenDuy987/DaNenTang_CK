import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductsDetailScreen = ({ route, navigation }) => {
    const [title, setTitle] = useState(route.params.title);
    const [image, setImage] = useState(route.params.image);
    const [price, setPrice] = useState(route.params.price);
    const [description, setDescription] = useState(route.params.description);
    const [rate, setRate] = useState(route.params.rate);
    const [count, setCount] = useState(route.params.count);
    //the header title is the product name
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: title });
    }, [navigation, title]);


    return (
        <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: image }} style={styles.productImage} />
            </View>
            <View style={styles.productDetails}>
                <Text style={styles.productDescription} >{description}</Text>
                <View style={styles.noteProductContainer}>
                    <View style={styles.noteProduct}>
                        <Text style={styles.productPrice}>${price}</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>{rate} </Text>
                            <Ionicons name="star" size={16} color="yellow" />
                            <Text style={styles.ratingText}>({count})</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ProductsDetailScreen;

const styles = StyleSheet.create({
    productContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    productImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: 400,
        height: 300,
        resizeMode: 'contain',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 16,
    },
    noteProductContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteProduct: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

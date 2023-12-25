import "core-js/stable/atob";
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // import dung
import { CommentsList } from '../comments/CommentsList'
import { useCart } from '../../context/CartContext';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const BookDetailScreen = ({ route, navigation }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState(route.params.title);
    const [image, setImage] = useState(route.params.image);
    const [price, setPrice] = useState(route.params.price);
    const [description, setDescription] = useState(route.params.description);
    const [authors, setAuthors] = useState(route.params.authors);
    const [categories, setCategories] = useState(route.params.categories);
    const [rate, setRate] = useState(route.params.rate);
    const [count, setCount] = useState(route.params.count);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [reload, setReload] = useState(false);
    const { fetchCartFromAPI } = useCart();
    const { state, dispatch } = useCart();
    const [book_id, setBook_id] = useState(route.params.Id);
    const [imageSource, setImageSource] = useState('');

    useEffect(() => {
        if (reload) {
            fetchCartFromAPI();
            console.log("Đã reload");
            setReload(false);
        }

    }, [reload]);
    useFocusEffect(
        useCallback(() => {
            // Fetch the comments or any other data you need when the screen gains focus
            fetchComments();
        }, [reload]) // Include 'reload' in the dependencies to refetch comments when reload changes
    );

    const fetchComments = async () => {
        try {

            const response = await axios.get(`http://10.0.2.2:3000/comments/book/${title}`);
            
            console.log('Comments fetched successfully:', response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const splitDescription = (description) => {
        if (!description) {
            console.warn('Description is undefined');
            return [];
        }
        // Split the description into paragraphs based on newline characters
        return description.split('\n');
    };

    const paragraphs = splitDescription(description);

    const handleChoosePhoto = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          console.log('Image picker result:', result);
          
          if (!result.canceled) {
            // Handle the selected image URI here
            console.log('Results', result.assets[0].uri);
            // You can also set the image source in your state if needed
            setImageSource(result.assets[0]?.uri || '');
          }
        } catch (error) {
          console.error('Error picking an image', error);
        }
      };

    const handleAddComment = async () => {
        try {
            const userId = jwtDecode(token).userId;
            console.log('Image source: ' + imageSource);
            const response = await axios.post('http://10.0.2.2:3000/comments/New',{
                userId: userId,
                date: new Date(),
                comment: comment,
                rating: rating,
                image: imageSource,
                bookTitle: title,
            });
            if (response.status === 200) {
                console.log('Add comment success');
            } else {
                throw new Error('Invalid credentials');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work.');
          }
        })();
      }, []);

    const handleAddToCart = async () => {
        // Check if the product with the given ID already exists in the cart
        const existingCart = state.cartItems[0];


        if (existingCart) {
            const existingItem = existingCart.products.find((cartItem) => cartItem.productId === book_id);

            if (existingItem) {
                Alert.alert('The product is already in the cart!');
                return;
            }
        }

        try {
            userId = jwtDecode(token).userId;
            console.log(userId);
            const response = await axios.post(`http://10.0.2.2:3000/carts/${userId}/add`, {
                productId: book_id,
                productTitle: title,
                productImage: image,
                price: getPrice(price),
                quantity: 1,
            });

            //dispatch({ type: 'ADD_TO_CART', payload: item });
            setReload(true);
            console.log('Thêm sản phẩm ' + book_id);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            Alert.alert('Error adding product to cart. Please try again.');
        }
    };

    const getPrice = (price) => {
            console.log('price: ' + price);
            if(price === 'N/A'){
                return `100`;
            } else {
                return price;
            }
        };

    //the header title is the product name
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: title });
    }, [navigation, title]);
    return (
        <View style={styles.productContainer}>
            <FlatList
        data={[
            { key: 'productDetails' },
            { key: 'description' },
            { key: 'noteProductContainer' },
            { key: 'feedBack' },
            { key: 'imagePickerContainer' },
            { key: 'commentContainer' },
            { key: 'commentsList' },
        ]}
        renderItem={({ item }) => {
            switch (item.key) {
                case 'productDetails':
                    return (
                        <View style={styles.productImageContainer}>
                            <Image source={{ uri: image }} style={styles.productImage} />
                        </View>                            
                    );
                case 'description':
                    return (
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.productDescription}>Description: {paragraphs}</Text>
                        </View>
                    );
                case 'noteProductContainer':
                    return (
                        <View style={styles.productDetails}>
                            <Text style={styles.productDescription} >Authors: {authors}</Text>
                            <Text style={styles.productDescription} >Category: {categories}</Text>
	                        <View style={styles.noteProductContainer}>
	                        <View style={styles.noteProduct}>
                                <Text style={styles.productPrice}>${getPrice(price)}</Text>
	                            <View style={styles.ratingContainer}>
	                                <Text style={styles.ratingText}>{rate} </Text>
	                                <Ionicons name="star" size={16} color="yellow"/>
	                                <Text style={styles.ratingText}>({count})</Text>
	                            </View>
	                        </View>
	                        </View>
                            <View style={styles.buyContainer}>
	                            <TouchableOpacity onPress={handleAddToCart}>
	                                <View style={styles.buyButton}>
	                                    <Text style={styles.buyText}>Buy</Text>
	                                </View>
	                            </TouchableOpacity>
	                        </View>
                        </View>
                        
                    );
                case 'feedBack':
                    return (
                        <View style={styles.feedBack}>
                            <View style={styles.feedBackContainer}>
	                            <Text style={styles.feedBackText}>FeedBack</Text>
	                            <TouchableOpacity>
	                                <Ionicons name="chatbox-ellipses-outline" size={24} color="green" />
	                            </TouchableOpacity>
	                        </View>
	                        <View style={styles.starContainer}>
	                        <StarRating
	                            disabled={false}
	                            maxStars={5}
	                            rating={Number(rating)}
	                            fullStarColor={'yellow'}
	                            selectedStar={(rating) => setRating(rating)}
	                            starSize={20}
	                        />
	                        </View>
	                        <View style={styles.commentContainer}>
	                            <Text style={styles.commentText}>Comment</Text>
	                            <View style={styles.comment}>
	                                <TextInput
	                                    style={styles.input}
	                                    onChangeText={setComment}
	                                    value={comment}
	                                    multiline={true}
	                                    numberOfLines={5}
	                                />
	                                <TouchableOpacity onPress={handleAddComment}>
	                                    <Ionicons name="send" size={24} color="green" />
	                                </TouchableOpacity>
	                            </View>
	                        </View>
                        </View>
                    );
                case 'imagePickerContainer':
                    return (
                        <View style={styles.imagePickerContainer}>
                            <TouchableOpacity onPress={handleChoosePhoto}>
	                            <Text style={styles.imagePickerText}>Choose photo</Text>
	                        </TouchableOpacity>
                        </View>
                    );
                case 'commentContainer':
                    return (
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentText}>Comments</Text>
                        </View>
                    );
                case 'commentsList':
                    return (
                        <View style={styles.commentList}>
                            <CommentsList bookTitle={title} navigation={navigation}/>
                        </View>
                    );
                default:
                    return null;
            }
        }}
        keyExtractor={(item) => item.key}
    />
    </View>
    );
}

export default BookDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
        width: 200,
        height: 150,
        resizeMode: 'contain',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productDescription: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noteProductContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noteProduct: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedBack: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginTop: 20,
    },
    feedBackText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentContainer: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
        textAlign: 'center',
    },
    comment: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 15,
        height: 50,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
    },
    feedBackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    descriptionContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    commentList: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10,
        width: '100%',
        height: 200,
    },
    buyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buyButton: {
        backgroundColor: 'green',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    imagePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    imagePickerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
    },
});
import "core-js/stable/atob";
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // import dung


const BookDetailScreen = ({ route, navigation }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState(route.params.title);
    const [image, setImage] = useState(route.params.image);
    const [price, setPrice] = useState(route.params.price);
    const [description, setDescription] = useState(route.params.description);
    const [rate, setRate] = useState(route.params.rate);
    const [count, setCount] = useState(route.params.count);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    const handleAddComment = async () => {
        try {
            const userId = jwtDecode(token).userId;
            const response = await axios.post('http://10.0.2.2:3000/comments/New',{
                userId: userId,
                date: new Date(),
                comment: comment,
                rating: rating,
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
                        <Ionicons name="star" size={16} color="yellow"/>
                        <Text style={styles.ratingText}>({count})</Text>
                    </View>
                </View>
            </View>
        </View>
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
        </View>
    );
}

export default BookDetailScreen;

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
});
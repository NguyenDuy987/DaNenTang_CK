import React, { useState, useEffect } from 'react';
import { FlatList, View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export const EditCommentScreen = ({ route, navigation }) => {
    const {token} = useAuth();
    const [Id, setId] = useState(route.params.Id);
    const [userId, setUserId] = useState(route.params.userId);
    const [date, setDate] = useState(route.params.date);
    const [rating, setRating] = useState(route.params.rating);
    const [comment, setComment] = useState(route.params.comment);
    const [bookTitle, setBookTitle] = useState(route.params.bookTitle);
    const [image, setImage] = useState(route.params.image);

    const handleEditComment = async () => {
        try {
            const response = await axios.put(`http://10.0.2.2:3000/comments/${Id}`, {
                userId: userId,
                date: date,
                comment: comment,
                rating: rating,
                image: image,
                bookTitle: bookTitle
            });
            if (response.status === 200) {
                console.log('Edit comment success');
                navigation.goBack();
            } else {
                throw new Error('Invalid credentials');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const changeImage = async () => {   
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
        });
        if (!result.canceled) {
            setImage(result.assets[0]?.uri);
        }
    }

    //the header title is the book title
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: bookTitle });
    }, [navigation, bookTitle]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit your comment</Text>
            <View style={styles.editContainer}>
                <View style={styles.ratingContainer}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={rating}
                        selectedStar={(rating) => setRating(rating)}
                        fullStarColor={'#FFD700'}
                        starSize={30}
                    />
                </View>
                <View style={styles.commentContainer}>
                    <TextInput
                        style={styles.commentInput}
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Write your comment here..."
                        onChangeText={(comment) => setComment(comment)}
                        value={comment}
                    />
                </View>
                { image ? 
                <TouchableOpacity style={styles.imageChange} onPress={changeImage}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: image }}
                        />
                    </View>
                </TouchableOpacity>: null}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleEditComment}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default EditCommentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10
    },
    editContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    ratingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    commentContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
    },
    imageContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        height: 200,
        resizeMode: 'contain',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        backgroundColor: '#FFD700',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageChange: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
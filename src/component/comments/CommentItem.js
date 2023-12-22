import "core-js/stable/atob";
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const BookItem = ({ comment, navigation }) => {
    const { token } = useAuth();
    const [comment, setComment] = useState(comment.comment);
    const [rating, setRating] = useState(comment.rating);
    const [date, setDate] = useState(comment.date);
    const [userComment, setUserComment] = useState(comment.userId);
    const [bookTitle, setBookTitle] = useState(comment.bookTitle);
    const [Id, setId] = useState(comment._id);

    const handleDeleteComment = async () => {
        try {
            const userId = jwtDecode(token).userId;
            //Check if the user is the owner of the comment
            if (userId === userComment) {
                const response = await axios.delete(`http://localhost:3000/comments/${Id}`);
                if (response.status === 200) {
                    console.log('Delete comment success');
                } else {
                    throw new Error('Invalid credentials');
                }
            } else {
                Alert.alert('You are not the owner of this comment');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleEditComment = async () => {
        try {
            const userId = jwtDecode(token).userId;
            //Check if the user is the owner of the comment
            if (userId === userComment) {
                navigation.navigate('EditComment', {
                    Id: Id,
                    userId: userId,
                    date: date,
                    comment: comment,
                    rating: rating,
                    bookTitle: bookTitle
                });
            } else {
                Alert.alert('You are not the owner of this comment');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Text style={styles.title}>{comment}</Text>
            </View>
            <View style={styles.noteContainer}>
                <View style={styles.note}>
                    <Text style={styles.price}>{rating}</Text>
                </View>
                <TouchableOpacity onPress={handleEditComment}>
                    <View style={styles.addCartContainer}>
                        <Ionicons name="create" size={24} color="blue" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteComment}>
                    <View style={styles.addCartContainer}>
                        <Ionicons name="trash" size={24} color="blue" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    noteContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    note: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    addCartContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    addCartText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
});
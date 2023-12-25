import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";

export const CommentItem = ({ comment, navigation }) => {
    const { token } = useAuth();
    const [username, setUsername] = useState('');
    const [userHasAccess, setUserHasAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const nameOfUser = comment.userId.username;
                setUsername(nameOfUser);
                console.log('username: ' + nameOfUser);
                const user_Id = jwtDecode(token).userId;

                setUserHasAccess(comment.userId._id === user_Id);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [comment.userId.username]);

    const handleDelete = async () => {
        try {
            console.log('comment._id: ' + comment._id);
            const response = await axios.delete(`http://10.0.2.2:3000/comments/delete/${comment._id}`);
    
            if (response.status === 200) {
                Alert.alert('Delete comment successfully!');
            } else {
                console.error('Failed to delete comment. Status code:', response.status);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEdit = () => {
        navigation.navigate('EditComment', {
            Id: comment._id,
            userId: comment.userId,
            date: comment.date,
            rating: comment.rating,
            comment: comment.comment,
            image: comment.image,
            bookTitle: comment.bookTitle,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentHeaderLeft}>
                        <View style={styles.commentHeaderLeftText}>
                            <Text style={styles.username}>{username}</Text>
                            <View style={styles.dateContainer}>
                                <Text style={styles.date}>{comment.date}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.commentHeaderRight}>
                        <Text style={styles.rating}>{comment.rating}</Text>
                        <Ionicons name="star" size={20} color="#FFD700" />
                    </View>
                </View>
                <View style={styles.commentBody}>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    {comment.image && (
                            <Image
                                style={styles.avatar}
                                source={{
                                    uri: comment.image,
                                }}
                            />
                        )}
                </View>
            </View>
            {userHasAccess && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.84, 
        elevation: 5,
        width: '95%',
        height: 200,
    },
    commentContainer: {
        flex: 1,
    },
    commentHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    commentHeaderLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    commentHeaderLeftText: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: '#808080',
    },
    commentHeaderRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: 10,
        marginBottom: 15,
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    commentBody: {
        flex: 1,
        marginTop: 10,
    },
    commentText: {
        fontSize: 16,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 5,
        borderRadius: 5,
        width: 60,
        marginHorizontal: 5,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateContainer: {
        marginTop: 10,
    },
});



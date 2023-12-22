import React, { useState, useEffect } from 'react';
import { FlatList, View, TextInput, Image } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import { useAuth } from '../../context/AuthContext';

export const EditCommentScreen = ({ route, navigation }) => {
    const {token} = useAuth();
    const [Id, setId] = useState(route.params.Id);
    const [userId, setUserId] = useState(route.params.userId);
    const [date, setDate] = useState(route.params.date);
    const [rating, setRating] = useState(route.params.rating);
    const [comment, setComment] = useState(route.params.comment);
    const [bookTitle, setBookTitle] = useState(route.params.bookTitle);

    const handleEditComment = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/comments/${Id}`, {
                userId: userId,
                date: date,
                comment: comment,
                rating: rating,
                bookTitle: bookTitle
            });
            if (response.status === 200) {
                console.log('Edit comment success');
            } else {
                throw new Error('Invalid credentials');
            }
        }
        catch (error) {
            console.log(error);
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
});
import React, { useState, useEffect } from 'react';
import { FlatList, View, Text } from 'react-native';
import axios from 'axios';
import { CommentItem } from '../comments/CommentItem';

export const CommentsList = ({ bookTitle, navigation }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('bookTitle: ' + bookTitle);
                const response = await axios.get(`http://10.0.2.2:3000/comments/book/${bookTitle}`);
                console.log('API Response:', JSON.stringify(response, null, 2));
                
                if (response.status === 200) {
                    console.log('Get comment success');
                    console.log('Comments Data:', JSON.stringify(response.data, null, 2));
                    const commentsData = response.data || [];
                    setComments(commentsData);
                } else {
                    throw new Error('There is no comment for this book!');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching comments');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookTitle]);

    if (loading) {
        return (
            <View>
                <Text>Loading comments...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>{error}</Text>
            </View>
        );
    }

    if (comments.length === 0) {
        return (
            <View>
                <Text>There is no comment for this book!</Text>
            </View>
        );
    }

    return (
        <View>
            <FlatList
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} navigation={navigation} />}
                keyExtractor={item => item._id}
                horizontal={true}
            />
        </View>
    );
};
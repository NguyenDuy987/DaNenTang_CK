import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import axios from 'axios';
import { CommentItem } from '../comments/CommentItem';

export const CommentList = ({ bookTitle, navigation }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/comments/${bookTitle}`);
                console.log(response.data);
                const filteredComments = response.data;
                setComments(filteredComments || []);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        
        fetchData();
    }
    , [bookTitle]);

    return (
        <View>
            <FlatList
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} navigation={navigation} />}
                keyExtractor={item => item.id}
                horizontal={false}
            />
        </View>
    );
}
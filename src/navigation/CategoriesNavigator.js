import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CategoriesScreen from '../screens/main/categories/CategoriesScreen';
import BookDetailScreen from '../component/books/BookDetailScreen';
import BookSearchList from '../component/books/BookSearchList';
import EditCommentScreen from '../component/comments/EditCommentScreen';

const Stack = createStackNavigator();

const navOptionHandler = () => ({
    headerShown: false
})

const CategoriesStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={navOptionHandler} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ tabBarVisible: false }} />
            <Stack.Screen name="SearchResult" component={BookSearchList} options={{ tabBarVisible: false }} />
            <Stack.Screen name="EditComment" component={EditCommentScreen} options={{ tabBarVisible: false }} />
        </Stack.Navigator>
    );
};

export default CategoriesStackNavigator;
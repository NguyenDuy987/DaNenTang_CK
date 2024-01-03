import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavList from '../screens/main/Favorites/FavList';
import FavDetailScreen from '../screens/main/Favorites/FavDetailScreen';

const Stack = createStackNavigator();
const navOptionHandler = () => ({
    headerShown: false
})

const FavStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Favorites" component={FavList} options={navOptionHandler} />
            <Stack.Screen name="FavoritesProductDetail" component={FavDetailScreen} options={{ tabBarVisible: false }} />
        </Stack.Navigator>
    );
};

export default FavStackNavigator;
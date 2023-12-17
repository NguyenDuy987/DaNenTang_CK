// src/navigation/HomeStackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/home/HomeScreen';
import ProductsDetailScreen from '../component/products/ProductsDetailScreen';

const Stack = createStackNavigator();
const navOptionHandler = () => ({
  headerShown: false
})

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={navOptionHandler}/>
      <Stack.Screen name="ProductDetail" component={ProductsDetailScreen} options={{tabBarVisible: false}}/>
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

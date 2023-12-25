import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../screens/main/cart/CartScreen';
import OrderScreen from "../screens/main/order/orderScreen"

const Stack = createStackNavigator();
const navOptionHandler = () => ({
    headerShown: false
})

const CartToOrderStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="Order" component={OrderScreen} />
        </Stack.Navigator>
    );
};

export default CartToOrderStackNavigator;
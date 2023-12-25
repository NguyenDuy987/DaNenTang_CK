import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/main/user/ProfileScreen';
import EditProfileScreen from '../screens/main/user/EditProfileScreen';
import ListOrderScreen from '../screens/main/order/ListOrderScreen';
import OrderDetailScreen from '../screens/main/order/OrderDetailScreen';
const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="OrderList" component={ListOrderScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/main/user/ProfileScreen';
import EditProfileScreen from '../screens/main/user/EditProfileScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
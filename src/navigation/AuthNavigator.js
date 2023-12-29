// AuthStackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false
})

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={navOptionHandler} />
      <Stack.Screen name="Register" component={RegisterScreen} options={navOptionHandler} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

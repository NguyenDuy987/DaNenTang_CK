// AuthStackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from "../screens/auth/ResetPass";

const Stack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: true
})

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={navOptionHandler} />
      <Stack.Screen name="Register" component={RegisterScreen} options={navOptionHandler} />
      <Stack.Screen name="Reset Password" component={ForgotPasswordScreen} options={navOptionHandler} />

    </Stack.Navigator>
  );
};

export default AuthNavigator;

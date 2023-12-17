// App.js or your main entry file

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const App = () => {

  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <Navigator />
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;

const Navigator = () => {
  const { user } = useAuth();
  return user ? <BottomTabNavigator /> : <AuthNavigator />;
};

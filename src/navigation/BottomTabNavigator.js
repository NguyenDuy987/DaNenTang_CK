import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeStackNavigator from './HomeStackNavigator';
import CategoriesScreen from '../screens/main/categories/CategoriesScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import CartScreen from '../screens/main/cart/CartScreen';
import CategoriesNavigator from './CategoriesNavigator';

//Screen names
const homeTab = "Home Tab";
const categoriesTab = "Categories";
const profileTab = "Profile";
const cartTab = "Cart";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {paddingBottom: "10", fontStyle: "normal"},
        tabBarStyle: {display: "flex"},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeTab) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === categoriesTab) {
            iconName = focused ? 'list' : 'list-outline';
          } else if (rn === cartTab) {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (rn === profileTab) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name={homeTab}
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Home'
        }} />
      <Tab.Screen name={categoriesTab} component={CategoriesNavigator} options={{headerShown: false}}/>
      <Tab.Screen name={cartTab} component={CartScreen} />
      <Tab.Screen name={profileTab} component={ProfileStackNavigator} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
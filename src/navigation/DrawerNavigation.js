// src/navigation/DrawerNavigator.js

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons instead of MaterialIcons
import HomeStackNavigator from './HomeStackNavigator';
import FavStackNavigator from './FavStackNavigator';

const Drawer = createDrawerNavigator();

const homeDrawer = "Home";
const FavDrawer = "Favorites";
const helpsDrawer = "Helps";

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName={homeDrawer}>
            <Drawer.Screen
                name={homeDrawer}
                component={HomeStackNavigator}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} /> // Use Ionicons name for the home icon
                    ),
                }}
            />
            <Drawer.Screen
                name={FavDrawer}
                component={FavStackNavigator}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} /> // Use Ionicons name for the notifications icon
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

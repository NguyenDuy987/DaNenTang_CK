
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Categories1Screen from './Categories1Screen';
import Categories2Screen from './Categories2Screen';
import Categories3Screen from './Categories3Screen';
import Categories4Screen from './Categories4Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
//20520469_NguyenDucDuy
const Tab = createMaterialTopTabNavigator();

const CategoriesScreen = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarLabelStyle: {paddingBottom: "10", fontStyle: "normal"},
      tabBarStyle: {display: "flex"},

      tabBarIcon: ({ color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === "Allproducts") {
          iconName = 'list';
        } else if (rn === "electronics") {
          iconName = 'laptop';
        } else if (rn === "jewelery") {
          iconName = 'diamond';
        } else if (rn === "men's clothing") {
          iconName = 'shirt';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      }
    })}
    >
      <Tab.Screen name="All" component={Categories1Screen} />
      <Tab.Screen name="electronics" component={Categories2Screen} />
      <Tab.Screen name="jewelery" component={Categories3Screen} />
      <Tab.Screen name="men's clothing" component={Categories4Screen} />
    </Tab.Navigator>
  );
};

export default CategoriesScreen;

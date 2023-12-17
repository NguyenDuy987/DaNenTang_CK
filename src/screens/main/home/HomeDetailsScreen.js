
import React, {useLayoutEffect} from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeDetailsScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        headerShown: false,
      });
    }
    return () => {
      if (parentNavigation) {
        parentNavigation.setOptions({
          headerShown: true,
        });
      }
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Details Screen</Text>
    </View>
  );
};
export default HomeDetailsScreen;

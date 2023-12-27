import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import BookLoader from '../../../assets/bookLoader.gif';

const CustomLoading = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Image
      style={{ width: 200, height: 200, resizeMode: 'contain' }}
      source={BookLoader}
    />
  </View>
);

export default CustomLoading;
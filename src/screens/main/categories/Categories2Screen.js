import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ProductList } from '../../../component/products/ProductList';

const electronics = 'electronics';

const Categories2Screen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.slogan}>Khẩu hiệu ứng dụng</Text>

      <Text style={styles.sectionTitle}>Electronics</Text>
      <ProductList productListType={electronics} navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  slogan: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default Categories2Screen;

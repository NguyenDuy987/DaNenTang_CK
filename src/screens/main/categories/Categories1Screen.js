import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ProductList } from '../../../component/products/ProductList';
const allProducts = 'Allproducts';
const Categories1Screen = ({ navigation }) => {
  const [cartCount, setCartCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.slogan}>Khẩu hiệu ứng dụng</Text>

      <Text style={styles.sectionTitle}>Hot Deals</Text>
      <ProductList productListType={allProducts} navigation={navigation} />
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

export default Categories1Screen;

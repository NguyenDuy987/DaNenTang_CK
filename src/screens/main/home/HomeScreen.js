
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ProductList } from '../../../component/products/ProductList';
import Carousel from 'react-native-reanimated-carousel';
import ad1 from '../../../../assets/ad_1.jpg';
import ad2 from '../../../../assets/ad_2.jpg';
import ad3 from '../../../../assets/ad_4.jpg';

const hotDealsData = 'HotDeals';
const newArrivalsData = 'NewArrivals';

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const carouselData = [
    { id: 1, image: ad1 },
    { id: 2, image: ad2 },
    { id: 3, image: ad3 },
  ];
  //20520469_NguyenDucDuy

  const fetchData = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      const data = response.data;
      console.log(data);
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.slogan}>Cửa hàng</Text>
      <Carousel
        loop
        width={400}
        height={200}
        autoPlay={true}
        data={carouselData}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => (
          <View style={styles.imageContainer}>
            <Image
              source={carouselData[index].image}
              style={styles.image}
            />
          </View>
        )
        }
      />
      <Text style={styles.sectionTitle}>Hot Deals</Text>
      <ProductList productListType={hotDealsData} navigation={navigation} />

      <Text style={styles.sectionTitle}>New Arrivals</Text>
      <ProductList productListType={newArrivalsData} navigation={navigation} />

    </View>
  );
};

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
    marginVertical: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
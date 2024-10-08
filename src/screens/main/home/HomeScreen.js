
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ProductList } from '../../../component/products/ProductList';
import Carousel from 'react-native-reanimated-carousel';
import ad1 from '../../../../assets/ad_1.jpg';
import ad2 from '../../../../assets/ad_2.jpg';
import ad3 from '../../../../assets/ad_4.jpg';
import * as SplashScreen from 'expo-splash-screen';
import CustomLoading from '../../../component/Loading/CustomLoading';

const hotDealsData = 'HotDeals';
const newArrivalsData = 'NewArrivals';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [appIsReady, setAppIsReady] = useState(false);
  const carouselData = [
    { id: 1, image: ad1 },
    { id: 2, image: ad2 },
    { id: 3, image: ad3 },
  ];
  const combinedData = [
    { id: 1, title: 'HOT DEALS', data: hotDealsData },
    { id: 2, title: 'NEW ARRIVALS', data: newArrivalsData },
  ];

  const renderItems = ({ item }) => {
    return (
      <View style={styles.typeProduct}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <ProductList productListType={item.data} navigation={navigation} />
      </View>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=country=US&saleInfo.saleability=FOR_SALE');
        setProducts(response.data.items);
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setAppIsReady(true);
      }
    }
    fetchData();
  }
    , []);

  const onLayoutRootView = async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
  };

  if (!appIsReady) {
    return <CustomLoading />;
  }

  return (
    <View 
      style={styles.container}
      onLayout={onLayoutRootView}
      >
      <Text style={styles.slogan}>GreenInk Library</Text>
      <Carousel
        loop
        width={400}
        height={200}
        autoPlay={true}
        data={carouselData}
        scrollAnimationDuration={2000}
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
      <FlatList
        data={combinedData}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
      />
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
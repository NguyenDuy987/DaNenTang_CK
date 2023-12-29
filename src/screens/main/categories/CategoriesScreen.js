import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, BackgroundColor} from 'react-native';
import { BookList } from '../../../component/books/BookList';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';
import CustomLoading from '../../../component/Loading/CustomLoading';

const categories = [
  { id: '1', name: 'Science Fiction' },
  { id: '2', name: 'Fantasy' },
  { id: '3', name: 'Romance' },
  { id: '4', name: 'Dog' },
  // Thêm các danh mục khác nếu cần
];

const CategoriesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);
  const [books, setBooks] = useState([]);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.categoryItemContainer}>
        <Text style={styles.categoryItem}>{item.name}</Text>
        <BookList bookListType={item.name} navigation={navigation} />
      </View>
    );
  };

  const handleSearchButton = () => {
    navigation.navigate('SearchResult', { searchText: searchText });
  };

  const handleCartButton = () => {
    navigation.navigate('Cart');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=country=US&saleInfo.saleability=FOR_SALE');
        setBooks(response.data.items);
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
        SplashScreen.hideAsync();
      }
  }

  if (!appIsReady) {
    return <CustomLoading />;
  }

  return (
    <View style={styles.container}>
      <View 
      style={styles.searchContainer}
      backgroundColor="green"
      >
        <TextInput 
         style={styles.searchInput} 
         onChangeText={setSearchText}
         placeholder="romance, adventure, horror, ..."
         value={searchText}
         backgroundColor="white"
         endEditing={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartButton}>
          <Ionicons name="cart" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View 
        style={styles.categoryItemContainer}
        onLayout={onLayoutRootView}
      >
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      </View>
    </View>
  );
}

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 15,
  },
  categoryItemContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  categoryItem: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  cartButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
});

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, BackgroundColor} from 'react-native';
import { BookList } from '../../../component/books/BookList';
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const categories = [
  { id: '1', name: 'Dog' },
  { id: '2', name: 'Fantasy' },
  { id: '3', name: 'Flower' },
  { id: '4', name: 'Science Fiction' },
  // Thêm các danh mục khác nếu cần
];

const CategoriesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
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
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
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

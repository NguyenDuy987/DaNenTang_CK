import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../../context/AuthContext';
import logo from '../../../assets/logoBookIcon.png';

const RegisterScreen = ({ navigation }) => {
  const { registerUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      const userData = {
        username,
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
        houseNumber,
        street,
        city,
      };

      await registerUser(userData);
      navigation.navigate('Login');
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={logo} style={styles.logoImage} />
        <Text h3 style={styles.title}>
          Register
        </Text>
      </View>
      <Input
        placeholder="Tên người dùng"
        value={username}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
      />
      <Input
        placeholder="Mật khẩu"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <Input
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <Input
        placeholder="Họ và tên đệm"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <Input
        placeholder="Tên"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <Input
        placeholder="Số nhà"
        value={houseNumber}
        onChangeText={(text) => setHouseNumber(text)}
      />
      <Input
        placeholder="Đường"
        value={street}
        onChangeText={(text) => setStreet(text)}
      />
      <Input
        placeholder="Thành phố"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <Button
        title="Register"
        onPress={handleRegister} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    width: '40%',
    borderRadius: 30,
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 30,
  },
});

export default RegisterScreen;

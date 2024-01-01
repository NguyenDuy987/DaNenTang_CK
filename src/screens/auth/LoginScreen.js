// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import logo from '../../../assets/logoBookIcon.png';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(username, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={logo} style={styles.logoImage} />
        <Text style={styles.title}>
          Welcome to GreenInk Library!
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.inputButton}
          title="Login"
          color="green"
          onPress={handleLogin}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.inputButton}
          title="Go to Register"
          color="green"
          onPress={() => navigation.navigate('Register')} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  inputButton: {
    borderRadius: 30,
  },
  buttonContainer: {
    width: '40%',
    borderRadius: 10,
    marginVertical: 10,
  }
});

export default LoginScreen;

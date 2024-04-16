// LoginScreen.tsx
import React, { useState , useContext } from 'react';
import { View, StyleSheet, Image , Alert, ActivityIndicator, Text } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { AuthService } from "../services/auth.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setToken } from "../utils/authUtils";
import AuthContext from "../utils/AuthContext";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('test@kamy.no');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handleLogin = async() => {
    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(username)) {
      Alert.alert('Ugyldig epost', 'E-postadressen du oppga er ikke gyldig.');
      return;
    }
  
    // Validate password is not empty
    if (!password.trim()) {
      Alert.alert('Tomt passord', 'Vennligst skriv inn passordet ditt');
      return;
    }
    
    try {
      setIsLoading(true); // Start loading animation
      const user = { email: username, password: password };
      const response = await AuthService.login(user);
      console.log('Login response:', response);
    
      if (response.success) {
        console.log('Login successful. Token:', response.data.token);
    
        login(response.data.token, response.data.user);
        
      } else {
        // Handle unsuccessful login
        Alert.alert('Login failed', response.data.message);
      }
    } catch (error) {
      // Handle network error or other errors
      Alert.alert('Login failed', 'An error occurred while trying to log in');
    } finally {
      setIsLoading(false); // Stop loading animation when API call finishes
    }
    

  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <TextInput
        label="E-post"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          label="Passord"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={!showPassword} // Toggle secure text entry
          style={styles.input}
        />
        <IconButton
          icon={showPassword ? 'eye-off' : 'eye'}
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>
      {isLoading ? ( // Show loading indicator when loading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Logg Inn
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 80,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
  },
  button: {
    marginTop: 10,
    width: '100%',
    padding: 10,
    borderRadius: 0,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

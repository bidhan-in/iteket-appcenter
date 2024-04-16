import React, { useContext, useEffect } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Provider as PaperProvider , MD3LightTheme } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './navigation/Tabs';
import LoginScreen from './screens/LoginScreen';

import AuthContext,{ AuthProvider } from './utils/AuthContext'; // Import the AuthContext
import DrawerNavigator from './screens/Navigator/Drawer';



const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#685bcb',
    secondary: 'blue',
    tertiary: '#a1b2c3',
    button: '#000', // button text
  },
};

const Drawer = createDrawerNavigator();

function App() {
    useEffect(() => {
      
      console.log('App.tsx: useEffect()');
    }, []);
  return (

  <PaperProvider theme={theme}>
  <AuthProvider>
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
      <Content />
      
      </NavigationContainer>
    </SafeAreaView>
  </AuthProvider>
</PaperProvider>
  );
}

const Content = () => {
  const { userToken } = React.useContext(AuthContext); // Ensure useContext is called within a functional component

  
  console.log('----userToken:', userToken);
  // Example conditional rendering based on userToken
  return userToken ? <DrawerNavigator/> : <LoginScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;

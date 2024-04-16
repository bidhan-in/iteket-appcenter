import * as React from 'react';
import { Text, View } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';



const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },          
        }} />
      
      <Tab.Screen name="Chat" component={ChatScreen} options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="wechat" size={size} color={color} />;
          },          
        }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },          
        }}/>
    </Tab.Navigator>
    
  );
}

export default MyTabs;

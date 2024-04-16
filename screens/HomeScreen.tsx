import React, { useState, useContext } from 'react';
import { ScrollView, Text, View } from "react-native";
import { Avatar, Button, Card, DataTable, Divider, IconButton, Menu, ProgressBar, TextInput } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AuthContext from '../utils/AuthContext'


function HomeScreen() {

    const { logout, userInfo } = useContext(AuthContext);

    handleLogout = () => {
        console.log('logout');
        logout();
    }

    return (

        <ScrollView>
            <View style={{ alignItems: 'center', padding: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 26 }} numberOfLines={1}>Hei, {userInfo?.first_name} {userInfo?.last_name}</Text>                    
                </View>
                

                <Button icon="power" mode="contained" onPress={handleLogout} style={{ marginTop: 100 }}>
                    Logout
                </Button>
            </View>
        </ScrollView>

    );
}
export default HomeScreen;


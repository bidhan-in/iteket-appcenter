// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, destroyToken, getUserInfo, getLoginTimestamp} from './authUtils';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const sessionDuration = 7 * 24 * 60 * 60 * 1000; // Session duration: 1 week in milliseconds
    
    useEffect(() => {
        checkUserToken();
    }, []);

    const checkUserToken = async () => {
        console.log('******checkUserToken');
        setIsLoading(true);
        const token = await getToken();
        const info = await getUserInfo(); // Retrieve user info from storage
        console.log('getUserInfo',info)
        setUserToken(token);
        setUserInfo(info); // Set user info state

        if (token) {
            const loginTimestamp = await getLoginTimestamp(); // Retrieve login timestamp
            console.log('loginTimestamp',loginTimestamp)
            const currentTime = new Date().getTime();
            const isExpired = currentTime - loginTimestamp > sessionDuration;
            if (isExpired) {
                // Session has expired, clear token and user info
                await destroyToken();
                setUserToken(null);
                setUserInfo(null);
                Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
            }
        }

        setIsLoading(false);
    };

    const login = async (token,userData) => {
        setUserToken(token);
        setUserInfo(userData); // Set user info state
        await setToken(token, userData); // Save the token and user info to storage
    };

    const logout = async () => {
        await destroyToken(); // Remove the token without passing any parameters
        setUserToken(null);
        setUserInfo(null); // Clear user info state
        console.log('logout done');
    };

    return (
        <AuthContext.Provider value={{ userToken, userInfo, login, logout, isLoading }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

const Loader = () => (
    <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
);

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthContext;

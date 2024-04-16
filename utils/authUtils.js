// authUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';

export const setToken = async (token, userInfo) => {
    try {
        const loginTimestamp = new Date().getTime();
        const userData = JSON.stringify({ token, loginTimestamp, userInfo });
        await AsyncStorage.setItem(TOKEN_KEY, userData);

    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async () => {
    try {
        const userData = await AsyncStorage.getItem(TOKEN_KEY);
        if (userData) {
            const { token } = JSON.parse(userData);
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const getUserInfo = async () => {

    try {
        const userData = await AsyncStorage.getItem(TOKEN_KEY);
        if (userData) {
            const { userInfo } = JSON.parse(userData);
            return userInfo;
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const getLoginTimestamp = async () => {
    try {
        const userData = await AsyncStorage.getItem(TOKEN_KEY);
        if (userData) {
            const { loginTimestamp } = JSON.parse(userData);
            return loginTimestamp;
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const destroyToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

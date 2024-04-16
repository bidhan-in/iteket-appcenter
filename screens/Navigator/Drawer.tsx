import React , {useContext} from'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';

import AntDesign from'react-native-vector-icons/AntDesign';
import { Image, Text, View } from 'react-native';
import SettingsScreen from '../SettingsScreen';
import FindScreen from '../FindScreen';
import HomeScreen from '../HomeScreen';
import AuthContext from '../../utils/AuthContext';
import ProductListScreen from '../ProductListScreen';
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
const CustomDrawerContent = (props) => {

    const { userInfo, logout } = useContext(AuthContext);

    handleLogout = () => {
        console.log("Logout");
        logout();
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff', paddingTop: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, rowGap: 10, columnGap: 10 }}>
                    <Image source={require('../../assets/images/user-avatar-default.png')} style={{ width: 60, height: 60, borderRadius: 100, }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16 }} numberOfLines={1}>Hei, {userInfo?.first_name} {userInfo?.last_name}</Text>
                        <Text style={{}}>{userInfo?.user_role}</Text>
                    </View>                    
                </View>
                <DrawerItemList {...props} />
                {/* Add custom drawer items if needed */}

            </DrawerContentScrollView>
            <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, padding: 1 }}>
                <DrawerItem label="Logout" 
                icon={({ color, size }) => ( <AntDesign name="poweroff" size={20} color={color} /> )}
                onPress={() => { handleLogout(); }} />
            </View>
        </View>

    );
};

function DrawerNavigator() {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                drawerIcon: ({ color, size }) => (
                    <AntDesign name="home" size={size} color={color} />
                ),
            }} />
            <Drawer.Screen name="Profile" component={FindScreen} 
            options={{
                drawerIcon: ({ color, size }) => (
                    <AntDesign name="user" size={size} color={color} />
                ),
            }}
            />
            <Drawer.Screen name="Settings" component={SettingsScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <AntDesign name="setting" size={size} color={color} />
                ),
            }} />
            <Drawer.Screen name="POS" component={ProductListScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <AntDesign name="shoppingcart" size={size} color={color} />
                ),
            }} />
        </Drawer.Navigator>
    );
}
export default DrawerNavigator;
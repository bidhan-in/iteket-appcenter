import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Button, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from './Loader';


const ProductListScreen = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1); // Current page
    const [perPage, setPerPage] = useState(10); // Products per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [totalProducts, setTotalProducts] = useState(0); // Total number of products
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSearch, setExpandedSearch] = useState(false); // State for expanded search
    const [cartItems, setCartItems] = useState([]);

    const fetchProducts = () => {
        const url = 'https://dev152.kamy.no/wp-json/wc/v3/products';
        const consumerKey = 'ck_502d1c46671bb5ff902b11b6707d4a13e3b59b77';
        const consumerSecret = 'cs_f28d86c98860f2fa5c5ccd2b7ec56035c6a0e050';
        setLoading(true);
        axios.get(url, {
            params: {
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                page: page,
                per_page: perPage,
                search: searchQuery,
            }
        })
            .then(response => {
                setProducts(response.data);
                setTotalPages(parseInt(response.headers['x-wp-totalpages'])); // Extract total pages from response headers
                setTotalProducts(parseInt(response.headers['x-wp-total'])); // Extract total products from response headers
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchProducts();
    }, [page, perPage]);

    useEffect(() => {
        // Retrieve cart items from AsyncStorage on component mount
        AsyncStorage.getItem('cartItems')
          .then((cartData) => {
            if (cartData) {
              setCartItems(JSON.parse(cartData));
            }
          })
          .catch((error) => console.error('Error retrieving cart items:', error));
      }, []); // Empty dependency array ensures this effect runs only once on component mount
    

    const handlePageChange = pageNumber => {
        setPage(pageNumber);
    };

    const handleItemsPerPageChange = itemsPerPage => {
        setPerPage(itemsPerPage);
    };

    const formatPrice = (price) => {
        //return price.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' });
        return price;
    };
    const handleSearch = query => {
        setSearchQuery(query);
    };
    const handleSearchSubmit = () => {
        setPage(1);
        fetchProducts(); // Trigger product search
    };

    const toggleExpandedSearch = () => {
        setExpandedSearch(!expandedSearch);
    };
    
    

    const addToCart = (product) => {
        return false;
        const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            setCartItems(updatedCartItems);
            AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
            
            const newCartItem = { id: product.id, quantity: 1, price: product.price };
            setCartItems([...cartItems, newCartItem]);
            AsyncStorage.setItem('cartItems', JSON.stringify([...cartItems, newCartItem]));
        }
        
    };
    
    const removeFromCart = (productId) => {
        return false;
        const existingItemIndex = cartItems.findIndex((item) => item.id === productId);
        if (existingItemIndex !== -1) {
            if (cartItems[existingItemIndex].quantity > 0) {
                const updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity -= 1;
                if (updatedCartItems[existingItemIndex].quantity === 0) {
                    updatedCartItems.splice(existingItemIndex, 1);
                }
                setCartItems(updatedCartItems);
                AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            }            
        }
        
    };
    
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    onSubmitEditing={handleSearchSubmit}
                />
                <TouchableOpacity onPress={toggleExpandedSearch} style={styles.expandIcon} >
                    <Ionicons name={expandedSearch? 'filter-outline' : 'filter-outline'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            {expandedSearch && (
                <View style={styles.expandedSearchContainer}>
                    <Text>More filter options if needed.</Text>
                </View>
            )}
            <ScrollView style={{ flex: 1 }}>
                <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    {/* <Text style={{ marginBottom: 16 }}>Number of Products: {totalProducts}</Text> */}

                    <DataTable>
                        {/* <DataTable.Header>
                        <DataTable.Title>Image</DataTable.Title>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title> </DataTable.Title>
                    </DataTable.Header> */}

                        {products.map(product => (
                            <DataTable.Row key={product.id} style={styles.tableRow}>
                                <DataTable.Cell style={styles.tableCellName}>
                                    <View style={styles.productInfoContainer}>
                                        {product.images[0]?.src ? (
                                            <Image source={{ uri: product.images[0]?.src }} style={styles.productImage} />
                                        ) : (
                                            <Text>No Image</Text>
                                        )}
                                        <View style={styles.productTextContainer}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <Text style={styles.productPrice}>kr {formatPrice(product.price)}</Text>
                                        </View>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell style={[styles.iconsCell]}>
                                    <View>
                                        <TouchableOpacity onPress={() => addToCart(product)}>
                                            <Text style={styles.iconQtyOp}><Icon name="pluscircleo" size={28} ></Icon></Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{paddingLeft:10,paddingRight:10,fontSize:20}}> {cartItems.find(item => item.id === product.id)?.quantity || 0}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                                            <Text style={styles.iconQtyOp}><Icon name="minuscircleo" size={28} ></Icon></Text>
                                        </TouchableOpacity>
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </View>
            </ScrollView>
            <View style={styles.paginationContainer}>
                <DataTable.Pagination
                    page={page}
                    numberOfPages={totalPages}
                    onPageChange={handlePageChange}
                    label={`${page} of ${totalPages}`}
                    numberOfItemsPerPageList={[10, 20, 30]}
                    numberOfItemsPerPage={perPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={''}
                />
                <Text style={{ marginBottom: 16 }}>
                    {loading && <Loader />} {/* Display loader overlay when loading is true */}
                </Text>
            </View>
            
            <View style={styles.cartWarper}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15}}>
                    
                    <View style={{backgroundColor:'#8076cf',borderRadius:10,padding:10}}>
                        <Text>
                            <Ionicons name="cart-outline" size={26} color="white"  />
                        </Text>
                    </View>                    
                    <View style={{paddingLeft:10}}>
                        <Text style={{color:'#fff',fontSize:18}}>{totalItems} Item</Text>                
                        <Text style={{color:'#fff',fontSize:18}}>kr {totalPrice.toFixed(2)}</Text>
                    </View>
                </View>                    
                <TouchableOpacity style={styles.viewCartButton}>
                <View style={{ flexDirection: 'row', alignItems: 'center',paddingRight:15 }}>
                    <Text style={{color:'#fff',fontSize:22,alignContent:'center',paddingRight:2 }}>View Cart</Text>
                    <Ionicons name="arrow-forward-outline" size={26} color="white" />
                </View>                    
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row', // Make the rows stack vertically
        justifyContent: 'space-between', // Center the content horizontally
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 15,
        borderColor: '#685bcb',
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    productInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
        marginRight: 10,
    },
    productTextContainer: {
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        color: '#000',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    tableCellName: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 8,
    },
    iconsCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationContainer: {
        margin: 0,
        paddingTop: 5,
        height: 60,
        alignItems: 'center',
    },
    iconQtyOp: {

    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        columnGap: 10,
    },
    searchInput: {
        height: 45,
        borderColor: '#dedede',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: '#fff',
    },
    expandIcon: {
        width: 45,
        height: 45,
        backgroundColor: '#fff',
        borderColor: '#dedede',
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandedSearchContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    //Cart
    cartWarper: {
        backgroundColor: '#685bcb',
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent:'space-between',
    }

});

export default ProductListScreen;

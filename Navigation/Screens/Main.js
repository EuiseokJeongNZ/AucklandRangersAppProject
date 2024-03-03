// Main.js

import React, { useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback, ScrollView, Image, Alert } from 'react-native';

import dish1Image from '../../assets/ScotchFilletWithMushroom.png';
import dish2Image from '../../assets/GrilledSalmonWithLemonButter.png';
import dish3Image from '../../assets/ChickenAlfredoPasta.png';
import dish4Image from '../../assets/MargheritaPizza.png';

import BackgroundImage from '../../assets/Background9.jpg';

import auth from '@react-native-firebase/auth';

export default function Main({ navigation}){
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const drawerAnimation = useRef(new Animated.Value(-250)).current;

  const toggleDrawer = () => {
    const newValue = drawerOpen ? -250 : 0;
    Animated.timing(drawerAnimation, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDrawerOpen(!drawerOpen);
  };
  
  const hideDrawer = () => {
    if (drawerOpen) {
      toggleDrawer();
    }
  };
  
  // 메뉴바 외부 클릭 핸들러
  const handleContentClick = () => {
    hideDrawer();
  };
  
  // 메뉴 항목 클릭 핸들러
  const handleMenuItemClick = () => {
    hideDrawer();
  };

  const [dishQuantities, setDishQuantities] = useState({
    dish1: 0,
    dish2: 0,
    dish3: 0,
    dish4: 0
  });

  const increaseQuantity = (dishName) => {
    setDishQuantities(prevState => ({
      ...prevState,
      [dishName]: prevState[dishName] + 1
    }));
  };

  const decreaseQuantity = (dishName) => {
    if (dishQuantities[dishName] > 0) {
      setDishQuantities(prevState => ({
        ...prevState,
        [dishName]: prevState[dishName] - 1
      }));
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        setIsLoggedIn(false);
        navigation.navigate('Main');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Logout failed', error.message);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={handleContentClick}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={[styles.logo, styles.textWhite]}>Auckland Rangers</Text>
          <TouchableOpacity style={styles.menuToggle} onPress={toggleDrawer}>
            <View style={styles.bar}></View>
            <View style={styles.bar}></View>
            <View style={styles.bar}></View>
          </TouchableOpacity>
        </View>

        <Animated.View
          ref={drawerRef}
          style={[
            styles.drawer,
            { right: drawerAnimation }
          ]}
        >
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Main'); }}>Home</Text>
          {isLoggedIn ? (
            <View>
              <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Profile'); }}> Profile </Text>
              <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout();}}>Log Out</Text>
            </View>
          ) : (
            <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Signin'); }}>Sign In</Text>
          )}


          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>
        
        <ScrollView>
        <Image source={BackgroundImage} style={styles.logoImage} />
          <TouchableWithoutFeedback onPress={handleContentClick}>
            <View style={styles.mainContainer}>
              <Text style={[styles.heading, styles.textBlack]}>Welcome to Auckland Rangers!</Text>
              <Text style={[styles.subHeading, styles.textBlack]}>Our Specials</Text>

              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => {hideDrawer(); }}>
                  <View style={styles.menuItemContent}>
                    <Image source={dish1Image} style={styles.dishImage} />
                    <Text style={[styles.textBlack]}>Scotch Fillet with Mushroom</Text>
                    <Text style={[styles.textBlack]}>Price: $44.50</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton} onPress={() => { decreaseQuantity('dish1'); hideDrawer(); }}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <View style={styles.quantityBorder}>
                        <Text style={[styles.textBlack, styles.quantityText]}>{dishQuantities.dish1}</Text>
                      </View>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {increaseQuantity('dish1'); hideDrawer();}}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => {hideDrawer(); }}>
                  <View style={styles.menuItemContent}>
                    <Image source={dish2Image} style={styles.dishImage} />
                    <Text style={[styles.textBlack]}>Grilled Salmon with Lemon Butter</Text>
                    <Text style={[styles.textBlack]}>Price: $28.00</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {decreaseQuantity('dish2'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <View style={styles.quantityBorder}>
                        <Text style={[styles.textBlack, styles.quantityText]}>{dishQuantities.dish2}</Text>
                      </View>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {increaseQuantity('dish2'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => {hideDrawer(); }}>
                  <View style={styles.menuItemContent}>
                    <Image source={dish3Image} style={styles.dishImage} />
                    <Text style={[styles.textBlack]}>Chicken Alfredo Pasta</Text>
                    <Text style={[styles.textBlack]}>Price: $23.50</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {decreaseQuantity('dish3'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <View style={styles.quantityBorder}>
                        <Text style={[styles.textBlack, styles.quantityText]}>{dishQuantities.dish3}</Text>
                      </View>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {increaseQuantity('dish3'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => {hideDrawer(); }}>
                  <View style={styles.menuItemContent}>
                    <Image source={dish4Image} style={styles.dishImage} />
                    <Text style={[styles.textBlack]}>Margherita Pizza</Text>
                    <Text style={[styles.textBlack]}>Price: $20.00</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {decreaseQuantity('dish4'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <View style={styles.quantityBorder}>
                        <Text style={[styles.textBlack, styles.quantityText]}>{dishQuantities.dish4}</Text>
                      </View>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => {increaseQuantity('dish4'); hideDrawer(); }}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.orderButton}>
                <Text 
                  style={[styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Reservation');}}>Reservation
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    backgroundColor: '#e44d26',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textWhite: {
    color: 'white',
  },
  textBlack: {
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  menuToggle: {
    width: 30,
    height: 30,
    justifyContent: 'space-between',
  },
  bar: {
    backgroundColor: 'white',
    height: 4,
    width: 30,
    marginVertical: 3,
  },
  drawer: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 170,
    alignItems: 'center',
    backgroundColor: '#e44d26',
    flexDirection: 'column',
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawerLink: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    margin: "auto"
  },
  drawerLinkMarginTop: {
    marginTop: 10,
  },
  active: {
    right: 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  heading: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subHeading: {
    fontSize: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  menuItem: {
    width: '45%',
    backgroundColor: '#eee',
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItemContent: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  dishImage: {
    width: '100%',
    height: 150,
    marginBottom: 15,
    borderRadius: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#e44d26',
    borderWidth: 2,
    borderColor: '#e44d26',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  quantityButtonText: {
    color: 'white',
  },
  quantityBorder: {
    borderWidth: 1,
    borderColor: '#e44d26',
    padding: 5,
    borderRadius: 4,
  },
  quantityText: {
    color: 'black',
    width: 20,
    textAlign: 'center',
    justifyContent: 'center',
  },
  orderButton: {
    backgroundColor: '#e44d26',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  logoImage:{
    width: '100%',
    height: 150,
  },
});

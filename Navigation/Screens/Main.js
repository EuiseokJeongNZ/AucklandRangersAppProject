// Main.js

import React, { useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback, ScrollView, Image, Alert } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


import dish1Image from '../../assets/ScotchFilletWithMushroom.png';
import dish2Image from '../../assets/GrilledSalmonWithLemonButter.png';
import dish3Image from '../../assets/ChickenAlfredoPasta.png';
import dish4Image from '../../assets/MargheritaPizza.png';

import BackgroundImage1 from '../../assets/Background9.jpg';
import BackgroundImage2 from '../../assets/Background10.jpg';
import BackgroundImage3 from '../../assets/Background7.jpg';
import BackgroundImage4 from '../../assets/Background5.jpg';
import BackgroundImage5 from '../../assets/Background4.jpg';
import BackgroundImage6 from '../../assets/Background3.jpg';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('menus')
      .onSnapshot(snapshot => {
        const newDishes = snapshot.docs.map(doc => ({
          menuId: doc.id,
          menuName: doc.data().menuName,
          menuPrice: doc.data().menuPrice,
          quantity: 0,
          menuRecommendation: doc.data().recommendation
        }));
        setMenus(newDishes);
      });
    return () => unsubscribe();
  }, []);

  // const [dishes, setDishes] = useState([
  //   { name: 'Scotch Fillet with Mushroom', quantity: 0, price: 44.50 },
  //   { name: 'Grilled Salmon with LemonButter', quantity: 0, price: 28.00 },
  //   { name: 'Chicken Alfredo Pasta', quantity: 0, price: 23.50 },
  //   { name: 'Margherita Pizza', quantity: 0, price: 20.00 },
  // ]);

  // const [dishes, setDishes] = useState([
  //   { name: 'Scotch Fillet With Mushroom', quantity: 0, price: 15.99 },
  //   { name: 'Grilled Salmon With Lemon Butter', quantity: 0, price: 18.99 },
  //   { name: 'Chicken Alfredo Pasta', quantity: 0, price: 12.99 },
  //   { name: 'Margherita Pizza', quantity: 0, price: 9.99 }
  // ]);

  const increaseQuantity = (menuName) => {
    setMenus(prevMenus => {
      return prevMenus.map(menu => {
        if (menu.menuName === menuName) {
          return { ...menu, quantity: menu.quantity + 1 };
        }
        return menu;
      });
    });
  };
  
  const decreaseQuantity = (menuName) => {
    setMenus(prevMenus => {
      return prevMenus.map(menu => {
        if (menu.menuName === menuName && menu.quantity > 0) {
          return { ...menu, quantity: menu.quantity - 1 };
        }
        return menu;
      });
    });
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

  const [orderButtonDisabled, setOrderButtonDisabled] = useState(true);
  useEffect(() => {
    const allMenusZero = menus.every(menu => menu.quantity === 0);
    setOrderButtonDisabled(allMenusZero);
  }, [menus]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [BackgroundImage1, BackgroundImage2, BackgroundImage3, BackgroundImage4, BackgroundImage5, BackgroundImage6]; // 다음 사진들의 배열

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3500); 

    return () => clearInterval(intervalId); 
  }, []); 

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
          {isLoggedIn ? (
                  <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
                ) : <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); Alert.alert("Please login first!");}}>
                Reservation
              </Text>
          }
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>
        
        <ScrollView>
        <Image source={images[currentImageIndex]} style={styles.logoImage} />
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
                      style={styles.quantityButton} 
                      onPress={() => { 
                        decreaseQuantity('Scotch Fillet with Mushroom'); 
                        hideDrawer(); 
                      }}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantityBorder}>
                      <Text style={[styles.textBlack, styles.quantityText]}>
                      {menus.find(menu => menu.menuName === 'Scotch Fillet with Mushroom')?.quantity}
                      </Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => { 
                        increaseQuantity('Scotch Fillet with Mushroom'); 
                        hideDrawer();
                      }}
                    >
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
                    <TouchableOpacity
                      style={styles.quantityButton} 
                      onPress={() => { 
                        decreaseQuantity('Grilled Salmon with Lemon Butter'); 
                        hideDrawer(); 
                      }}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantityBorder}>
                      <Text style={[styles.textBlack, styles.quantityText]}>
                      {menus.find(menu => menu.menuName === 'Grilled Salmon with Lemon Butter')?.quantity}

                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => { 
                        increaseQuantity('Grilled Salmon with Lemon Butter'); 
                        hideDrawer();
                      }}
                    >
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
                    <TouchableOpacity
                      style={styles.quantityButton} 
                      onPress={() => { 
                        decreaseQuantity('Chicken Alfredo Pasta'); 
                        hideDrawer(); 
                      }}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantityBorder}>
                      <Text style={[styles.textBlack, styles.quantityText]}>
                      {menus.find(menu => menu.menuName === 'Chicken Alfredo Pasta')?.quantity}

                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => { 
                        increaseQuantity('Chicken Alfredo Pasta'); 
                        hideDrawer();
                      }}
                    >
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
                    <TouchableOpacity
                      style={styles.quantityButton} 
                      onPress={() => { 
                        decreaseQuantity('Margherita Pizza'); 
                        hideDrawer(); 
                      }}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.quantityBorder}>
                      <Text style={[styles.textBlack, styles.quantityText]}>
                      {menus.find(menu => menu.menuName === 'Margherita Pizza')?.quantity}

                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => { 
                        increaseQuantity('Margherita Pizza'); 
                        hideDrawer();
                      }}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.orderButton}>
              {isLoggedIn ? (
                  <Text style={[styles.textWhite]} onPress={() => { hideDrawer();
                    if (!orderButtonDisabled) {
                      navigation.navigate('Reservation', { menus });
                    }
                    else{
                      Alert.alert("Check quantity!");
                    }
                  }}>
                    Order
                  </Text>
                ) : (
                  <Text style={[styles.textWhite]} onPress={() => { hideDrawer(); Alert.alert("Please login first!");}}>
                    Order
                  </Text>
                )}
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

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function OrderDetail({ navigation, route }) {
  const {menus} = route.params; 

  const {bookingDate} = route.params;
  const {bookingTime} = route.params;
  const {name} = route.params;
  const {phoneNumber} = route.params;
  const {people} = route.params;

  const totalPrice = menus.reduce((total, menu) => total + (menu.menuPrice * menu.quantity), 0);

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
          <TouchableOpacity style={styles.menuToggle} onPress={()=>{toggleDrawer();}}>
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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Profile'); }}> Profile </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout();}}>Log Out</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
          <View style={styles.orderDetail}>
          <View style={styles.orderInfo}>
          <Text style={styles.heading}>Order Detail</Text>
          <Text><Text style={styles.bold}>Booking Date:</Text> {bookingDate}</Text>
          <Text><Text style={styles.bold}>Booking Time:</Text> {bookingTime}</Text>
          <Text><Text style={styles.bold}>Name:</Text> {name}</Text>
          <Text><Text style={styles.bold}>Phone Number:</Text> {phoneNumber}</Text>
          <Text><Text style={styles.bold}>Number of People:</Text> {people}</Text>
          <View style={styles.orderItems}>
            <Text style={styles.subheading}>Order Items</Text>

            {menus.map((menu, index) => (
              menu.quantity !== 0 ? (
                <View key={index}>
                  <Text>Dish: {menu.menuName}</Text>
                  <Text>Price: ${(menu.menuPrice).toFixed(2)}</Text>
                  <Text>Quantity: {menu.quantity}</Text>
                  <Text></Text>
                </View>
              ) : null
            ))}

            </View>
  <Text style={styles.totalOrderPrice}><Text style={styles.bold}>Total Order Price (including 15% GST):</Text> ${totalPrice.toFixed(2)}</Text>
  <TouchableOpacity style={styles.button} onPress={() => {hideDrawer(); navigation.navigate('PaymentOption', {menus, bookingDate, bookingTime, name, phoneNumber, people});}}>
    <Text style={styles.buttonText}>Proceed to Payment</Text>
  </TouchableOpacity>
</View>
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
  orderDetail: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  orderInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  orderItems: {
    marginTop: 20,
    marginBottom: 20,
  },
  totalOrderPrice: {
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e44d26',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

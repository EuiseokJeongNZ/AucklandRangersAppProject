import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, ScrollView, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function PaymentOption({ navigation, route }){
  
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
  
  const handleContentClick = () => {
    hideDrawer();
  };
  
  const handleMenuItemClick = () => {
    hideDrawer();
  };

  const [userID, setUserID] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const { menus, bookingDate, bookingTime, name, phoneNumber, people } = route.params;

  const [paymentOption, setPaymentOption] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserID(user.uid);
      } else {
        console.log('User is not signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const addDishesToOrders = async (menus) => {
    try {
      const ordersRef = firestore().collection('orders');

      const combinedMenu = menus.reduce((accumulator, currentMenu) => {
        if (currentMenu.quantity !== 0) {
          accumulator[currentMenu.menuId] = {
            menuId: currentMenu.menuId,
            menuName: currentMenu.menuName,
            menuPrice: currentMenu.menuPrice,
            quantity: currentMenu.quantity,
          };
        }
        return accumulator;
      }, {});

    
    combinedMenu['userID'] = userID;
     
     const currentDate = new Date();
     const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
     const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
     const formattedDateTime = `${formattedDate} ${formattedTime}`;
 
     combinedMenu['orderTime'] = formattedDateTime;

    const docRef = await ordersRef.add(combinedMenu);
    const orderId = docRef.id;
    
    try {
      const reservationsRef = firestore().collection('reservations');
      const newReservation = {
        userId: userID,
        orderId: orderId,
        reservationName: name,
        reservationPhoneNumber: phoneNumber,
        reservationDate: bookingDate,
        reservationTime: bookingTime,
        reservationNumberOfPeople: people,
        reservationPaymentOption: paymentOption,
        reservationCardNumber: cardNumber,
        reservationExpiryMonth: expiryMonth,
        reservationExpiryYear: expiryYear,
        reservationCardCvv: cvv
      };
      await reservationsRef.add(newReservation);
      console.log('Reservation added to Firestore successfully!');
    } catch (error) {
      console.error('Error adding reservation to Firestore: ', error);
    }
  } catch (error) {
    console.error('Error adding menus to orders: ', error);
  }
};

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
  };

  const formatCardNumber = (input) => {
    let formatted = input.replace(/\s/g, '');
    if (formatted.length > 0) {
      formatted = formatted.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    return formatted;
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
          <TouchableOpacity style={styles.menuToggle} onPress={()=>{toggleDrawer(); }}>
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
          <View style={styles.paymentRatingScreen}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Payment</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Payment Option:</Text>
            </View>
            <Picker
              selectedValue={paymentOption}
              style={styles.picker}
              onValueChange={(itemValue) => handlePaymentOptionChange(itemValue)}>
              <Picker.Item label="Credit" value="credit" />
              <Picker.Item label="Debit" value="debit" />
              <Picker.Item label="Cash" value="cash" />
            </Picker>

            {paymentOption !== 'cash' && (
              <View style={styles.cardInfoForm}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Card Number:</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  keyboardType="numeric"
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  value={cardNumber}
                  onBlur={hideDrawer}
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Expiry Date:</Text>
                </View>
                <View style={styles.expiryContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    placeholder="MM"
                    maxLength={2}
                    keyboardType="numeric"
                    onChangeText={(text) => setExpiryMonth(text)}
                    value={expiryMonth}
                    onBlur={hideDrawer}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="YY"
                    maxLength={2}
                    keyboardType="numeric"
                    onChangeText={(text) => setExpiryYear(text)}
                    value={expiryYear}
                    onBlur={hideDrawer}
                  />
                </View>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>CVV:</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  maxLength={3}
                  keyboardType="numeric"
                  onChangeText={(text) => setCvv(text)}
                  value={cvv}
                  onBlur={hideDrawer}
                />
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={()=>{ hideDrawer();
              {
                if (cardNumber === '' || cardNumber.length < 12) {
                  Alert.alert("Please check your card number!");
                  }
                else if (expiryMonth === '' || !(0 < expiryMonth && expiryMonth < 13) || expiryYear === ''){
                  Alert.alert("Please check your expiry date!");
                }
                else if (cvv === ''){
                  Alert.alert("Please check your cvv!");
                }
                else{
                  Alert.alert("Thank you for the order!");
                  navigation.navigate('Main'); addDishesToOrders(menus);
                }
              } 
            }}>
              <Text style={styles.buttonText} >Submit</Text>
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
  paymentRatingScreen: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    marginTop: 50,
    maxWidth: 400,
    justifyContent: 'center'
  },
  
  headingContainer: {
    alignItems: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  form: {
    //
  },
  labelContainer: {
    marginBottom: 5,
  },
  label: {
    color: '#333',
  },
  picker: {
    width: '100%',
    padding: 8,
    borderWidth: 2,
    borderColor: '#e44d26',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#333',
  },
  cardInfoForm: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e44d26',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#333',
  },
  expiryContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#e44d26',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

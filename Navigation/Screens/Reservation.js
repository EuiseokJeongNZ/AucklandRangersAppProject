// Reservation.js

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, TextInput, Keyboard, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// onBlur={hideDrawer}

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Contact from './Contact';

export default function Reservaion({ navigation, route }){
  const {menus} = route.params; 
  
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

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [people, setPeople] = useState(1);

  let bookingDate = '';
  let bookingTime = '';

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const decrementPeople = () => {
    if (people > 1) {
      setPeople(people - 1);
    }
  };

  const incrementPeople = () => {
    setPeople(people + 1);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setSelectedDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setSelectedTime(currentTime);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-NZ', options);
    bookingDate = formattedDate
    return formattedDate;
  };

  const formatTime = (time) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedTime = time.toLocaleTimeString('en-NZ', options);
    bookingTime = formattedTime
    return formattedTime;
  };

  const isTimeValid = (time) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    return (hour > 11 || (hour === 11 && minute >= 30)) && (hour < 22 || (hour === 22 && minute === 0));
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setName(userData.name);
            setPhoneNumber(userData.phoneNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Profile'); }}> Profile </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout();}}>Log Out</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
          <View style={styles.reservationForm}>
          <Text style={styles.heading}>Add/Edit Reservation</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              required
              onBlur={hideDrawer}
            />
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPhoneNumber(text)}
              value={phoneNumber}
              placeholder="Enter your phone number"
              keyboardType="numeric"
              required
              onBlur={hideDrawer}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity style={styles.datetime} onPress={() => {setShowDatePicker(true); hideDrawer();} }>
              <Text style={styles.selectButtonText}>Select date</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
                onBlur={hideDrawer}
              />
            )}
            
            {selectedDate && (
              <View style={styles.selectedDateTime}>
                <Text style={styles.selectedDateTimeText} >Selected Date: {formatDate(selectedDate)}</Text>
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity style={styles.datetime} onPress={() => {setShowTimePicker(true); hideDrawer();}}>
              <Text style={styles.selectButtonText}>Select time</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChangeTime}
                minimumDate={new Date()}
                onBlur={hideDrawer}
              />
            )}
            {selectedTime && !isTimeValid(selectedTime) && (
              <View style={styles.selectedDateTime}>
                <Text style={styles.selectedDateTimeText}>Please select a time between 11:30 AM and 10:00 PM.</Text>
              </View>
            )}
            {selectedTime && isTimeValid(selectedTime) && (
              <View style={styles.selectedDateTime}>
                <Text style={styles.selectedDateTimeText}>Selected Time: {formatTime(selectedTime)}</Text>
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of People:</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity style={styles.button} onPress={()=>{decrementPeople(); hideDrawer();}}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{people}</Text>
              <TouchableOpacity style={styles.button} onPress={()=>{incrementPeople(); hideDrawer();}}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => { hideDrawer();
              if (bookingDate === '') {
                  Alert.alert("Select date!");
              } 
              else if(bookingTime === ''){
                Alert.alert("Please select a time between 11:30 AM and 10:00 PM!");
              }
              else if(name === ''){
                Alert.alert("Please input your name!");
              }
              else if(phoneNumber === ''){
                Alert.alert("Please input phone number!");
              }
              else if(phoneNumber.length < 10){
                Alert.alert("Please check your phone number!");
              }
              else {
                  navigation.navigate('OrderDetail', {menus, name, phoneNumber, bookingDate, bookingTime, people});
              }
          }} style={[styles.saveButton, styles.centered]}>
              <Text style={styles.saveButtonText}>Order Detail</Text>
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
  reservationForm: {
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
  heading: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
  numberInput: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
    width: '30%',
    padding: 8,
    borderWidth: 2,
    borderColor: '#e44d26',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 8,
    width: 45,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 8,
    marginBottom: 20,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 12,
    width: 150,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  datetime:{
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  centered: {
    alignSelf: 'center',
  },
  selectedDateTime: {
    width: '100%',
    padding: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e44d26',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#333',
  },
  selectedDateTimeText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  }
});

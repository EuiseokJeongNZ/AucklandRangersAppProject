import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, 
  TouchableOpacity, TouchableWithoutFeedback, TextInput, 
  Animated, Keyboard, ScrollView, Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// onBlur={hideDrawer}

export default function Signup({ navigation }){
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      
      Alert.alert('Example: example@email.com');
      Alert.alert('Input correct email structure!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }

    if (phoneNumber == ''){
      Alert.alert("Input phone number!");
      return;
    }

    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      
      await firestore().collection('users').doc(user.uid).set({
        email,
        password,
        name,
        phoneNumber,
      });

      Alert.alert('Thank You for Sign Up!');

      navigation.navigate('Signin');
    } catch (error) {
      console.error(error);
      Alert.alert('Already uesed the email! Please try again!');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleContentClick}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={[styles.logo, styles.textWhite]}>
            Auckland Rangers
            </Text>
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
          <Text style={[styles.drawerLink, styles.textWhite]} 
          onPress={() => { hideDrawer(); navigation.navigate('Main'); }}>
            Home
            </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} 
          onPress={() => { hideDrawer(); navigation.navigate('Signin'); }}>
            Sign In
            </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} 
          onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>
            Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} 
          onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>
            Reservation
            </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} 
          onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>
            Contact
            </Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
          <View style={styles.signupContainer}>
          <Text style={styles.heading}>Sign Up</Text>
          <View style={styles.form}>
            <Text style={styles.label}><Text style={styles.required}>*</Text>Email:</Text>
            <TextInput style={styles.input} onBlur={hideDrawer}
            value={email} 
            onChangeText={setEmail} 
            placeholder="Email" autoCapitalize="none"/>

            <Text style={styles.label}><Text style={styles.required}>*</Text>Password:</Text>
            <TextInput style={styles.input} onBlur={hideDrawer}
            value={password}
            onChangeText={setPassword} 
            secureTextEntry={true} placeholder="Password"/>

            <Text style={styles.label}><Text style={styles.required}>*</Text>Confirm Password:</Text>
            <TextInput style={styles.input} onBlur={hideDrawer}
            value={confirmPassword}
            onChangeText={setConfirmPassword} 
            secureTextEntry={true} placeholder="Confirm Password" />

            <Text style={styles.label}><Text style={styles.required}>*</Text>Phone Number:</Text>
            <TextInput style={styles.input} onBlur={hideDrawer}
            value={phoneNumber}
            onChangeText={setPhoneNumber} maxLength={12}
            placeholder="Phone Number" keyboardType="phone-pad" />

            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} onBlur={hideDrawer}
            value={name}
            onChangeText={setName}
            placeholder="Username" autoCapitalize="none"/>

            <TouchableOpacity style={styles.button} onPress={()=>{handleContentClick(); hideDrawer(); handleSignUp();}}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginLink}>
            <Text>Already have an account?</Text>
            <Text style={styles.link} onPress={() => { hideDrawer(); navigation.navigate('Signin');}}>Login here</Text>
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
  signupContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: 300,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heading: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flexDirection: 'column',
  },
  label: {
    textAlign: 'left',
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: 'red',
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
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#e44d26',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
  loginLink: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#333',
  },
  link: {
    color: '#e44d26',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
});
// Signin.js

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Animated, Keyboard, ScrollView, Alert } from 'react-native';
// onBlur={hideDrawer}

import auth from '@react-native-firebase/auth';

export default function Signin({ navigation }) {
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

  const handleLogin = async () => {
    try {
      if(email == '' || password == ''){
        Alert.alert('Fill in the blank!');
        return;
      } 
      const response = await auth().signInWithEmailAndPassword(email, password);
      
      Alert.alert('Logged in successfully!');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login failed!');
    }
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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Signin'); }}>Sign In</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); Alert.alert("Please login first!");}}>
                Reservation
              </Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
            <View style={styles.loginContainer}>
              <Text style={styles.title}>Welcome to Our Restaurant!</Text>
              <View style={styles.form}>
                <Text style={styles.label}>ID:</Text>
                <TextInput style={styles.input} onBlur={hideDrawer}
                 value={email}
                 onChangeText={(text) => setEmail(text)}
                 placeholder="Enter your ID" autoCapitalize="none" />
                <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} onBlur={hideDrawer}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter your password" secureTextEntry={true} />
                <TouchableOpacity style={styles.button} onPress={()=>{ hideDrawer(); handleContentClick(); handleLogin();}}>
                  <Text style={styles.buttonText} >Log in</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.signupLink}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity>
                  <Text style={styles.signupLinkText} onPress={() => { hideDrawer(); navigation.navigate('Signup'); }} >Sign up</Text>
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
  loginContainer: {
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
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    alignItems: 'center',
  },
  label: {
    textAlign: 'left',
    marginBottom: 5,
    color: '#333',
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
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#e44d26',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#333',
  },
  signupLinkText: {
    color: '#e44d26',
    textDecorationLine: 'underline',
  },
});

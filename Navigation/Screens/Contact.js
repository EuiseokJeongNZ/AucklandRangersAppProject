// Contact.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Image, TouchableWithoutFeedback,
  Animated, Linking, ScrollView, Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';// onBlur={hideDrawer}

import BackgroundImage1 from '../../assets/Background1.jpg';
import BackgroundImage2 from '../../assets/Background9.jpg';
import BackgroundImage3 from '../../assets/Background8.jpg';
import BackgroundImage4 from '../../assets/Background6.jpg';
import BackgroundImage5 from '../../assets/Background7.jpg';
import BackgroundImage6 from '../../assets/Background2.jpg';

import auth from '@react-native-firebase/auth';

export default function Contact({ navigation }) {
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [BackgroundImage1, BackgroundImage2, BackgroundImage3, BackgroundImage4, BackgroundImage5, BackgroundImage6];

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
              <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout(); }}>Log Out</Text>
            </View>
          ) : (
            <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Signin'); }}>Sign In</Text>
          )}
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          {isLoggedIn ? (
            <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          ) : <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); Alert.alert("Please login first!"); }}>
              Reservation
            </Text>
          }
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
            <View style={styles.content}>
              <Image source={images[currentImageIndex]} style={styles.logoImage} />
              <Text style={styles.heading}>CONTACT US</Text>
              <Text style={styles.subheading}>We're easy to find!</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: -36.8496208190918,
                  longitude: 174.76527404785156,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                provider={MapView.PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomControlEnabled={true}
                apiKey={"https://maps.googleapis.com/maps/api/js?key=AIzaSyA8fhy2bTJiglp1N7OJnOKGbeEyaoldcqc&callback=console.debug&libraries=maps,marker&v=beta"}
              >
                <Marker
                  coordinate={{ latitude: -36.8496208190918, longitude: 174.76527404785156 }}
                  title="New Zealand Skills and Education College (NZSE) - Auckland CBD Campus"
                />
              </MapView>

              <Text style={styles.info}>Phone: 027 363 3954</Text>
              <Text style={styles.info}>Address: 242 Queen Street, Auckland CBD, Auckland 1010</Text>
              <Text style={styles.info}>Opening Hours: Monday-Sunday, 11:30 AM - 10:00 PM</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:euiseokjeongnz@gmail.com')}>
                <Text style={[styles.info, styles.email]}>Email: euiseokjeongnz@gmail.com</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: 150,
  },
  heading: {
    fontSize: 35,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 23,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    color: '#333',
  },
  map: {
    flex: 1,
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  info: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    marginBottom: 15,
    color: 'black'
  },
  email: {
    color: '#e44d26',
    marginBottom: 50,
  },
});

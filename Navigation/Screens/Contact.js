// Contact.js

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, 
  TouchableOpacity, Image, TouchableWithoutFeedback, 
  Animated, Linking, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';// onBlur={hideDrawer}

import BackgroundImage from '../../assets/Background1.jpg';

export default function Contact({ navigation }){
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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
          <View style={styles.content}>
          <Image source={BackgroundImage} style={styles.logoImage} />
            <Text style={styles.heading}>CONTACT US</Text>
            <Text style={styles.subheading}>We're easy to find!</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -36.84970379999999,
                longitude: 174.76158928936883,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              provider={MapView.PROVIDER_GOOGLE} // Google Maps provider 추가
              showsUserLocation={true} // 사용자 위치 표시 설정 (선택사항)
              showsMyLocationButton={true} // 내 위치 버튼 표시 설정 (선택사항)
              zoomControlEnabled={true} // 줌 컨트롤러 표시 설정 (선택사항)
              // 이하 API 키 추가
              apiKey={"https://maps.googleapis.com/maps/api/js?key=AIzaSyA8fhy2bTJiglp1N7OJnOKGbeEyaoldcqc&callback=console.debug&libraries=maps,marker&v=beta"}
            >
              <Marker
                coordinate={{ latitude: -36.84970379999999, longitude: 174.76158928936883 }}
                title="New Zealand Skills and Education College (NZSE) - Auckland CBD Campus"
              />
            </MapView>

            <Text style={styles.info}>Phone: 027 363 3954</Text>
            <Text style={styles.info}>Address: 242 Queen Street, Auckland CBD, Auckland 1010</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:euiseokjeongnz@gmail.com')}>
              <Text style={[styles.info, styles.email]}>Email: euiseokjeongnz@gmail.com</Text>
            </TouchableOpacity>
            <Text style={styles.info}>Opening Hours: Monday-Sunday, 11:30 AM - 10:00 PM</Text>
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
  logoImage:{
    width: '100%',
    height: 150,
  },
  heading: {
    fontSize: 30,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // 텍스트 색상 변경
  },
  map: {
    flex: 1,
    width: '100%',
    height: 300,
    marginBottom: 20, // 지도 아래 여백 추가
  },
  info: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16, // 폰트 사이즈 조정
  },
  email: {
    color: '#e44d26',
  },
});

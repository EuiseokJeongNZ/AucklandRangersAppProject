import React, { useEffect, useState, useRef, emailInputRef, passwordInputRef, confirmPasswordInputRef, phoneNumberInputRef, usernameInputRef } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, Animated, ScrollView, Keyboard,
newPasswordInputRef, confirmNewPasswordInputRef } from 'react-native';

import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

export default function Profile({ navigation }){
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

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Main');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Logout failed', error.message);
      });
  };

  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        setName(userData.name);
        setPhoneNumber(userData.phoneNumber);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    try {
      const currentUser = auth().currentUser;
  
      if (!currentUser) {
        return;
      }
  
      if (currentPassword == '' || newPassword == '' || confirmNewPassword == '') {
  
        await firestore().collection('users').doc(currentUser.uid).update({
          name: name,
          phoneNumber: phoneNumber,
        });
        Alert.alert('Success', 'Profile updated successfully!');
        return;
      }
  
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Error', 'New password and confirm password do not match.');
        return;
      }
  
      const credential = auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await currentUser.reauthenticateWithCredential(credential);
      await currentUser.updatePassword(newPassword);
  
      // Update Firestore user data
      await firestore().collection('users').doc(currentUser.uid).update({
        name: name,
        password: newPassword,
        phoneNumber: phoneNumber,
      });
  
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Profile'); }}>Profile</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout();}}>Log Out</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
          <View style={styles.profileContainer}>
          <Text style={styles.heading}>User Profile</Text>
          <View style={styles.form}>
            <Text style={styles.label}><Text style={styles.required}>*</Text>Email:</Text>
            <TextInput 
              ref={emailInputRef}
              style={styles.input} 
              placeholder="Email"
              onBlur={hideDrawer}
              onChangeText={(text) => setUser(prevUser => ({ ...prevUser, email: text }))}
              value={user ? user.email : ''}
              editable={false}
            />

            <Text style={styles.label}><Text style={styles.required}>*</Text>Password:</Text>
                <TextInput 
                  ref={passwordInputRef}
                  style={styles.input} 
                  secureTextEntry={true} 
                  placeholder="Current Password" 
                  onBlur={hideDrawer}
                  onChangeText={(text) => setCurrentPassword(text)}
                  value={currentPassword}
                />

                <Text style={styles.label}><Text style={styles.required}>*</Text>New Password:</Text>
                <TextInput 
                  ref={newPasswordInputRef}
                  style={styles.input} 
                  secureTextEntry={true} 
                  placeholder="New Password" 
                  onBlur={hideDrawer}
                  onChangeText={(text) => setNewPassword(text)}
                  value={newPassword}
                />

                <Text style={styles.label}><Text style={styles.required}>*</Text>Confirm New Password:</Text>
                <TextInput 
                  ref={confirmNewPasswordInputRef}
                  style={styles.input} 
                  secureTextEntry={true} 
                  placeholder="Confirm New Password" 
                  onBlur={hideDrawer}
                  onChangeText={(text) => setConfirmNewPassword(text)}
                  value={confirmNewPassword}
                />

                <Text style={styles.label}><Text style={styles.required}>*</Text>Phone Number:</Text>
                <TextInput 
                  ref={phoneNumberInputRef}
                  style={styles.input} 
                  placeholder="Phone Number" 
                  keyboardType="phone-pad" 
                  onBlur={hideDrawer}
                  onChangeText={(text) => setPhoneNumber(text)}
                  value={phoneNumber}
                />

                <Text style={styles.label}>Username:</Text>
                <TextInput 
                  ref={usernameInputRef}
                  style={styles.input} 
                  placeholder="Username" 
                  onBlur={hideDrawer}
                  onChangeText={(text) => setName(text)}
                  value={name}
                />

            <TouchableOpacity style={styles.button} onPress={() => {
              handleChangePassword();
            }}>
              <Text style={styles.buttonText}>Update Profile</Text>
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
  profileContainer: {
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
    marginLeft: 5,
  },
});

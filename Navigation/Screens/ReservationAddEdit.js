import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert, ScrollView, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ReservationAddEdit({ navigation }) {
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

  const [userID, setUserID] = useState(null);

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

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reservations')
      .where('userId', '==', userID)
      .onSnapshot(snapshot => {
        const data = [];
        snapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setReservations(data);
      });

    return () => unsubscribe();
  }, [userID]);

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


  const OrderDetailsScreen = ({ id }) => {
    const [menuDetails, setMenuDetails] = useState([]);
  
    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const orderDoc = await firestore().collection('orders').doc(id).get();
          if (orderDoc.exists) {
            const orderData = orderDoc.data();
            const menuDetails = Object.values(orderData).filter(item => typeof item === 'object');
            setMenuDetails(menuDetails);
          } else {
            console.log("Order not found");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };
  
      fetchOrderDetails();
    }, [id]);
    
    const incrementRecommendation = async (menuId) => {
      try {
        await firestore().collection('menus').doc(menuId).update({
          recommendation: firestore.FieldValue.increment(1)
        });
      } catch (error) {
        console.error("Error incrementing recommendation:", error);
      }
    };

    return (
      <View>
    {menuDetails.map((menu, index) => (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text>Menu Name: {menu.menuName}</Text>
        <Text>Menu Price: ${menu.menuPrice.toFixed(2)}</Text>
        <Text>Quantity: {menu.quantity}</Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#e44d26',
            borderRadius: 4,
            padding: 10,
            marginTop: 10,
            width: 150,
            alignSelf: 'center',
          }}
          onPress={() => {incrementRecommendation(menu.menuId); Alert.alert("Thank your for recommendation!")}}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Recommend</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
    );
    
  };

  const handleDelete = async (reservationId, orderId) => {
    try {
      await firestore().collection('reservations').doc(reservationId).delete();
      console.log('Reservation deleted successfully.');

      if (orderId) {
        await firestore().collection('orders').doc(orderId).delete();
        console.log('Order associated with the reservation deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      Alert.alert('Error', 'Failed to delete reservation.');
    }
  };

  let reservationID = '';
  let bookingName = '';
  let phoneNumber = '';
  let numberOfPeople = 1;


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
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout(); }}>Log Out</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          <TouchableWithoutFeedback onPress={handleContentClick}>
            <View style={styles.reservationItem}>
              {reservations.map((reservation, index) => (
                <View style={styles.cardContainer} key={index}>
                  <Text>Date: {reservation.reservationDate}</Text>
                  <Text>Reservation Name: {reservation.reservationName}</Text>
                  <Text>Reservation Number of People: {reservation.reservationNumberOfPeople}</Text>
                  <Text>Reservation Phone Number: {reservation.reservationPhoneNumber}</Text>
                  <Text>Reservation Time: {reservation.reservationTime}</Text>
                  <Text></Text>
                  <Text>Order ID: {reservation.orderId}</Text>

                  <OrderDetailsScreen id={reservation.orderId} />

                  <TouchableOpacity
                    style={[styles.editButton, { alignSelf: 'center' }]}
                    onPress={() => { hideDrawer(); navigation.navigate('ReservationForEdit'); }}
                  >
                    <Text style={styles.buttonText} onPress={()=>{reservationID = reservation.id; bookingName = reservation.reservationName;
                    phoneNumber = reservation.reservationPhoneNumber, numberOfPeople = reservation.reservationNumberOfPeople;
                      navigation.navigate('ReservationForEdit', {reservationID, bookingName, phoneNumber, numberOfPeople});}}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={[styles.deleteButton, { alignSelf: 'center' }]}
                      onPress={() => { 
                          Alert.alert(
                              "Delete Confirmation",
                              "Are you sure you want to delete?",
                              [
                                  {
                                      text: "Cancel",
                                      style: "cancel"
                                  },
                                  {
                                      text: "Delete",
                                      onPress: () => {
                                          hideDrawer(); 
                                          handleDelete(reservation.id, reservation.orderId);
                                      }
                                  }
                              ]
                          );
                      }}
                  >
    <Text style={styles.buttonText}>Delete</Text>
</TouchableOpacity>

                </View>
              ))}
              
              <TouchableOpacity
                style={[styles.addButton, { alignSelf: 'center' }]}
              >
                <Text style={styles.buttonText} onPress={() => { navigation.navigate('Main'); }}>Add Reservation</Text>
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
  reservationItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardContainer: {
    margin: 20,
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e44d26',
  },
  text: {
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    width: 100,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    width: 100,
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e44d26',
    borderRadius: 4,
    padding: 15,
    fontSize: 15, 
    marginTop: 20,
    width: 200,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
});
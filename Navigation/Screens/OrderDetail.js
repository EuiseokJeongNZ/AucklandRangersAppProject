import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';

export default function OrderDetail({ navigation }) {
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

  const [totalOrderPrice, setTotalOrderPrice] = useState(0);

  useEffect(() => {
    const addOrderItem = (name, price, quantity) => {
      // 주문 항목 추가 및 총 주문 가격 업데이트 로직
    };

    // 데이터베이스 연결
    addOrderItem('Grilled Salmon with Lemon Butter', 28.00, 2);
    // updateCurrentDateAndTime(); // 현재 날짜와 시간 업데이트는 React Native에서 다르게 처리해야 할 수 있습니다.
  }, []);

  const goToPayment = () => {
    console.log('Proceeding to payment...');
    // Additional logic for payment navigation
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
          <View style={styles.orderDetail}>
          <View style={styles.orderInfo}>
            <Text style={styles.heading}>Order Detail</Text>
            <Text><Text style={styles.bold}>Order Number:</Text> #123456</Text>
            {/* 현재 날짜 및 시간 표시 방법은 React Native에서 다르게 처리해야 할 수 있습니다. */}
            {/* <Text><Text style={styles.bold}>Date:</Text> <Text id="currentDate"></Text></Text>
            <Text><Text style={styles.bold}>Time:</Text> <Text id="currentTime"></Text></Text> */}
            <View style={styles.orderItems}>
              <Text style={styles.subheading}>Order Items</Text>
              {/* 주문 항목들 표시 */}
            </View>
            <Text style={styles.totalOrderPrice}><Text style={styles.bold}>Total Order Price (including 15% GST):</Text> ${totalOrderPrice.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={() => {hideDrawer(); navigation.navigate('PaymentOption');}}>
              <Text style={styles.buttonText}>Proceed to Payment</Text></TouchableOpacity>
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

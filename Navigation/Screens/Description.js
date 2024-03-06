import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, ScrollView, Alert, FlatList, getImageSource} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Description({ navigation }){
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

  // const menuItems = [
  //   {
  //     menuName: 'Scotch Fillet with Mushroom',
  //     imageURL: require('../../assets/ScotchFilletWithMushroom.png'),
  //     ingredients: ['Scotch Fillet', 'Mushroom', 'Seasoning'],
  //     recipe: '1. Season the scotch fillet with salt and pepper.2. Grill the scotch fillet to desired doneness.3. Sauté mushrooms in butter until tender.4. Serve the grilled scotch fillet with sautéed mushrooms on top.',
  //     nutritionalValue: 'Calories: 550, Protein: 40g, Fat: 30g, Carbs: 5g',
  //     menuPrice: '$44.50'
  //   },
  //   {
  //     menuName: 'Grilled Salmon with Lemon Butter',
  //     imageURL: require('../../assets/GrilledSalmonWithLemonButter.png'),
  //     ingredients: ['Salmon Fillet', 'Lemon', 'Butter', 'Seasoning'],
  //     recipe: '1. Season the salmon fillet with salt and pepper.\n2. Grill the salmon fillet until cooked through.\n3. Melt butter in a pan and add lemon juice.\n4. Pour lemon butter sauce over the grilled salmon before serving.',
  //     nutritionalValue: 'Calories: 400, Protein: 30g, Fat: 20g, Carbs: 10g',
  //     menuPrice: '$28.00'
  //   },
  //   {
  //     menuName: 'Chicken Alfredo Pasta',
  //     imageURL: require('../../assets/ChickenAlfredoPasta.png'),
  //     ingredients: ['Chicken Breast', 'Pasta', 'Cream', 'Parmesan Cheese', Garlic'],
  //     recipe: '1. Cook pasta according to package instructions.\n2. Sauté chicken breast until cooked through.\n3. In a separate pan, heat cream and minced garlic.\n4. Add cooked pasta and chicken to the cream sauce.\n5. Serve hot with grated parmesan cheese on top.',
  //     nutritionalValue: 'Calories: 600, Protein: 35g, Fat: 25g, Carbs: 50g',
  //     price: '$23.50'
  //   },
  //   {
  //     menuName: 'Margherita Pizza',
  //     imageURL: require('../../assets/MargheritaPizza.png'),
  //     ingredients: ['Pizza Dough', 'Tomatoes', 'Fresh Mozzarella', 'Basil', 'Olive Oil'],
  //     recipe: '1. Stretch pizza dough into desired shape.\n2. Spread tomato sauce over the dough.\n3. Arrange slices of fresh mozzarella and tomato on top.\n4. Drizzle with olive oil and sprinkle with fresh basil.\n5. Bake in a preheated oven until crust is golden brown and cheese is bubbly.',
  //     nutritionalValue: 'Calories: 800, Protein: 20g, Fat: 30g, Carbs: 60g',
  //     price: '$20.00'
  //   },
  // ];

  const getImageSource = (imageURL) => {
    switch (imageURL) {
      case '../../assets/GrilledSalmonWithLemonButter.png':
        return require('../../assets/GrilledSalmonWithLemonButter.png');
      case '../../assets/ChickenAlfredoPasta.png':
        return require('../../assets/ChickenAlfredoPasta.png');
      case '../../assets/MargheritaPizza.png':
        return require('../../assets/MargheritaPizza.png');
      case '../../assets/ScotchFilletWithMushroom.png':
        return require('../../assets/ScotchFilletWithMushroom.png');
      default:
        return null;
    }
  };
  
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const menuCollection = firestore().collection('menus');
      const snapshot = await menuCollection.get();
      const menuList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenus(menuList);
    };

    fetchMenus();
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
              <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); handleLogout();}}>Log Out</Text>
            </View>
          ) : (
            <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Signin'); }}>Sign In</Text>
          )}
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Description'); }}>Menu</Text>
          {isLoggedIn ? (
                  <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('ReservationAddEdit'); }}>Reservation</Text>
                ) : <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); Alert.alert("Please login first!");}}>
                Reservation
              </Text>
          }
          <Text style={[styles.drawerLink, styles.textWhite]} onPress={() => { hideDrawer(); navigation.navigate('Contact'); }}>Contact</Text>
        </Animated.View>

        <ScrollView>
          {menus.map((menus, index) => (
            <TouchableOpacity key={index} >
              <View style={styles.foodDescriptionScreen}>
                <Text style={styles.title}>{menus.menuName}</Text>
                <Image source={getImageSource(menus.imageURL)} style={styles.dishImage} />
                <Text>
                  <Text style={styles.bold}>Price:</Text> 
                  {' $'} 
                  {menus.menuPrice.toFixed(2)}
                </Text>
                <Text></Text>
                <Text style={styles.bold}>Ingredients</Text>
                <Text>{menus.ingredients}</Text>
                <Text></Text>
                <Text style={styles.bold}>Recipe</Text>
                <Text>{menus.recipe}</Text>
                <Text></Text>
                <Text style={styles.bold}>Nutritional Value</Text>
                <Text>{menus.nutritionalValue}</Text>
                <Text></Text>

                <Text style={styles.bold}>recommendation: {menus.recommendation}</Text>
                <Text></Text>
              </View>
            </TouchableOpacity>
          ))}
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
  foodDescriptionScreen: {
    margin: 20,
    marginBottom: 10, // 각 메뉴 항목 사이의 간격 조절
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  dishImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
});

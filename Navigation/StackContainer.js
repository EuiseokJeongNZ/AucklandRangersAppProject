import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './Screens/Main';
import Signin from './Screens/Signin';
import Signup from './Screens/Signup';
import Profile from './Screens/Profile';
import Contact from './Screens/Contact';
import Description from './Screens/Description';
import Reservation from './Screens/Reservation';
import ReservationForEidt from './Screens/ReservationForEdit';
import ReservationAddEdit from './Screens/ReservationAddEdit';
import PaymentOption from './Screens/PaymentOption';
import OrderDetail from './Screens/OrderDetail';

const Stack = createStackNavigator();

const main = 'Main';
const signin = 'Signin';
const signup = 'Signup';
const profile = 'Profile';
const contact = 'Contact';
const description = 'Description';
const reservation = 'Reservation';
const reservationForEdit = 'ReservationForEdit';
const reservationAddEdit = 'ReservationAddEdit';
const paymentOption = 'PaymentOption';
const oderDetail = 'OrderDetail';


const App = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen name={main} component={Main} options={{headerShown: false,}} />
            <Stack.Screen name={signin} component={Signin} options={{headerShown: false,}} />
            <Stack.Screen name={signup} component={Signup} options={{headerShown: false,}} />
            <Stack.Screen name={profile} component={Profile} options={{headerShown: false,}} />
            <Stack.Screen name={contact} component={Contact} options={{headerShown: false,}} />
            <Stack.Screen name={description} component={Description} options={{headerShown: false,}} />
            <Stack.Screen name={reservation} component={Reservation} options={{headerShown: false,}} />
            <Stack.Screen name={reservationForEdit} component={ReservationForEidt} options={{headerShown: false,}} />
            <Stack.Screen name={reservationAddEdit} component={ReservationAddEdit} options={{headerShown: false,}} />
            <Stack.Screen name={paymentOption} component={PaymentOption} options={{headerShown: false,}} />
            <Stack.Screen name={oderDetail} component={OrderDetail} options={{headerShown: false,}} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    
});

export default App;
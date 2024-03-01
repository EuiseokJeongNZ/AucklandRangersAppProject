// App.js

import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './navigation/StackContainer';

const App = () => {

    return (
      <NavigationContainer>
        <StackContainer />
      </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    
});

export default App;
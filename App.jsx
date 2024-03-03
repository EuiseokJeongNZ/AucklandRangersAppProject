// App.js

import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackContainer from './Navigation/StackContainer';

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

// import React, { useEffect } from 'react';
// import { View, Text, Button, TextInput } from 'react-native';
// import auth from '@react-native-firebase/auth';

// const SignUpScreen = () => {
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');

//   const signUp = () => {
//     auth().createUserWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         // Signed up
//         const user = userCredential.user;
//         console.log('User signed up:', user);
//       })
//       .catch((error) => {
//         const { code, message } = error;
//         console.log('Error signing up:', message);
//       });
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Sign Up</Text>
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={{ borderWidth: 1, borderColor: 'gray', width: 200, marginVertical: 10, padding: 5 }}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={{ borderWidth: 1, borderColor: 'gray', width: 200, marginVertical: 10, padding: 5 }}
//       />
//       <Button title="Sign Up" onPress={signUp} />
//     </View>
//   );
// };

// export default SignUpScreen;

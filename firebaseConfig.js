// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQwJa3o2ZTikXTuakfaQfVPG86fZhfZLs",
  authDomain: "aucklandrangersappprojec-bd352.firebaseapp.com",
  databaseURL: "https://aucklandrangersappprojec-bd352-default-rtdb.firebaseio.com",
  projectId: "aucklandrangersappprojec-bd352",
  storageBucket: "aucklandrangersappprojec-bd352.appspot.com",
  messagingSenderId: "271695298416",
  appId: "1:271695298416:web:67fdedbdbb65a5f96b19b5",
  measurementId: "G-D45R2Q4GGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
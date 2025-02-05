// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "vexpy-firebase.firebaseapp.com",
  projectId: "vexpy-firebase",
  storageBucket: "vexpy-firebase.appspot.com",
  messagingSenderId: "881485525480",
  appId: "1:881485525480:web:78649c800948ddf09f745d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

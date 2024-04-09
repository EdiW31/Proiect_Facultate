import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQFxm3yrQHtB_y3Qmnn2ufO3PaquL4h1k",
  authDomain: "gestionare-bani.firebaseapp.com",
  projectId: "gestionare-bani",
  storageBucket: "gestionare-bani.appspot.com",
  messagingSenderId: "597149936489",
  appId: "1:597149936489:web:51f5103a8636cc7901abf8",
  databaseURL: "https://gestionare-bani-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

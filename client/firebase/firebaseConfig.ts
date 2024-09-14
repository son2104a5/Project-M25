// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyA83Ljx4k0haSYvgwx8uI4QIPeN9ufnxpE",
  authDomain: "project-m2-4c29a.firebaseapp.com",
  projectId: "project-m2-4c29a",
  storageBucket: "project-m2-4c29a.appspot.com",
  messagingSenderId: "516131686333",
  appId: "1:516131686333:web:6c292f59b3cc0e1671f4d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
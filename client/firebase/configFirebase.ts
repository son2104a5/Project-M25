// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5znOedWg0OUKir6OkebsxbRPWojJDZIA",
  authDomain: "m25-project-cde45.firebaseapp.com",
  projectId: "m25-project-cde45",
  storageBucket: "m25-project-cde45.appspot.com",
  messagingSenderId: "967633495546",
  appId: "1:967633495546:web:ccb15c4f08fd7c9b2d3043",
  measurementId: "G-LT7WL255YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const analytics = getAnalytics(app);

export { storage }
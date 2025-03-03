// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU1qPgsot3JKNHPkxs7dCZLNB8M4hjzjk",
  authDomain: "internshalaclone-42786.firebaseapp.com",
  projectId: "internshalaclone-42786",
  storageBucket: "internshalaclone-42786.firebasestorage.app",
  messagingSenderId: "922049622078",
  appId: "1:922049622078:web:10e63e65a658e751c6616f",
  measurementId: "G-L64TMD8VCL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider};
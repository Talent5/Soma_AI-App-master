// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMh2-AOZeFTsJdhVnqsbpIkyAPXfChTxI",
  authDomain: "soma-ai.firebaseapp.com",
  projectId: "soma-ai",
  storageBucket: "soma-ai.appspot.com",
  messagingSenderId: "928048536810",
  appId: "1:928048536810:web:79dd27e309647196ef4b93",
  measurementId: "G-FZ2JVCQ0G0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();  // <--- Export the provider

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCO3l55aX_ioxH73LGGSilAyrpjw5zqCj4",
    authDomain: "grade-gain.firebaseapp.com",
    projectId: "grade-gain",
    storageBucket: "grade-gain.appspot.com",
    messagingSenderId: "872835697836",
    appId: "1:872835697836:web:cbca603b9e5694dba22309"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app, "gs://grade-gain.appspot.com");

export { db, storage };
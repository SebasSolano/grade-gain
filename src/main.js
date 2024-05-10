import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)

app.mount('#app')

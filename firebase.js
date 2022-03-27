import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyCBzIco7k_5mhKg6n51Zthss6bM7riKOqI",
    authDomain: "pokemon-game-16c22.firebaseapp.com",
    projectId: "pokemon-game-16c22",
    storageBucket: "pokemon-game-16c22.appspot.com",
    messagingSenderId: "27391183125",
    appId: "1:27391183125:web:a93f488378d5f8e5afc11c"
  };

  const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {db, auth, provider};
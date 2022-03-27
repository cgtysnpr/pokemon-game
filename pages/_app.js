import "../styles/globals.css";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AnimatePresence } from "framer-motion";
function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      });
    }
  }, [user]);
  return (
    <AnimatePresence exitBeforeEnter>
      <Component {...pageProps} />
    </AnimatePresence>
  );
}

export default MyApp;

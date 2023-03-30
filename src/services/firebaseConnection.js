
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDXT7HBUXiK45r-xGn-c7PU6hTFExLBP34",
    authDomain: "tickets-b0b8d.firebaseapp.com",
    projectId: "tickets-b0b8d",
    storageBucket: "tickets-b0b8d.appspot.com",
    messagingSenderId: "414785797840",
    appId: "1:414785797840:web:8b944d50f11a320eefe8d5",
    measurementId: "G-75S5G8ZW8X"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage};
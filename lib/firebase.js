import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDpM6-hpsqsjPIUMZB5MAhtkVBHlyG5-8E",
  authDomain: "wms-macboot.firebaseapp.com",
  projectId: "wms-macboot",
  storageBucket: "wms-macboot.firebasestorage.app",
  messagingSenderId: "602947631917",
  appId: "1:602947631917:web:76a69017e3a149a9db71a4"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBS-M9P-kMUIPcWZvQNAoEiPpQGrLHc_wA",
  authDomain: "waste-collection-report-system.firebaseapp.com",
  projectId: "waste-collection-report-system",
  storageBucket: "waste-collection-report-system.firebasestorage.app",
  messagingSenderId: "181457958203",
  appId: "1:181457958203:web:578809eba848d60b77f31e",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

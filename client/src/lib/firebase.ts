import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgvH0CpF6tGISpfLw3JWJCT2beBG28wAM",
  authDomain: "kaylakay-cdf64.firebaseapp.com",
  projectId: "kaylakay-cdf64",
  storageBucket: "kaylakay-cdf64.firebasestorage.app",
  messagingSenderId: "663099511740",
  appId: "1:663099511740:web:5db3589db9bd323df791b9",
  measurementId: "G-WLH8VJCEC8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Analytics can only be used in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

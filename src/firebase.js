// Import only what you use
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics'; // optional, only if needed

const firebaseConfig = {
    apiKey: "AIzaSyCwOLdPmp_Kgb-l9cHxM0bP4T7138qQPgA",
    authDomain: "grip-7df3d.firebaseapp.com",
    projectId: "grip-7df3d",
    storageBucket: "grip-7df3d.appspot.com", // ✅ fixed: ".app" → ".app**spot**.com"
    messagingSenderId: "742256029669",
    appId: "1:742256029669:web:6e994d7f87d238c62ac90c",
    measurementId: "G-PNLL69CTRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Only use analytics if running in the browser and it’s needed
// const analytics = getAnalytics(app);

export default app;

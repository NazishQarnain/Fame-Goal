// Firebase Configuration
// Replace these values with your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyBi5Pp_Cv08J4Rd69ACrP1F15C-yP2nd9w",
  authDomain: "my-social-media-24c11.firebaseapp.com",
  projectId: "my-social-media-24c11",
  storageBucket: "my-social-media-24c11.firebasestorage.app",
  messagingSenderId: "210343971319",
  appId: "1:210343971319:web:fbec2f09244d7caa8d46f2",
  databaseURL: "https://my-social-media-24c11-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other files
window.auth = auth;
window.db = db;
window.storage = storage;

// =============================================================
// ⚠️  IMPORTANT: Replace with YOUR Firebase config keys.
// Firebase Console → Project Settings → Your Web App → firebaseConfig
// =============================================================
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Guard: only initialize if keys are real
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let auth = null;
let googleProvider = null;
let db = null;

if (isConfigured) {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
}

export { auth, googleProvider, db, isConfigured };

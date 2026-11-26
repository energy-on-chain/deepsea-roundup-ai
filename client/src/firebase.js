import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

var firebaseConfig = null;
if (import.meta.env.VITE_NODE_ENV === "staging") {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_STAGING,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_STAGING,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_STAGING,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_STAGING,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_STAGING,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_STAGING,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_STAGING
  };
} else if (import.meta.env.VITE_NODE_ENV === "production") {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PRODUCTION,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PRODUCTION,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PRODUCTION,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PRODUCTION,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PRODUCTION,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_PRODUCTION,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_PRODUCTION
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Admin API calls need proof of sign-in: when an admin is signed in, attach their
// Firebase ID token to every request to our own /api/ routes. The server checks it
// (api/middleware/auth.js). Signed-out visitors' requests go out unchanged.
const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url || String(input);
  const apiBases = ["", window.location.origin, import.meta.env.VITE_SERVER_URL_STAGING, import.meta.env.VITE_SERVER_URL_PRODUCTION]
    .filter((b) => b !== undefined && b !== null)
    .map((b) => b.replace(/\/$/, ""));
  const isOurApi = apiBases.some((base) => url.startsWith(`${base}/api/`));
  if (isOurApi) {
    await auth.authStateReady();
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
      headers.set("Authorization", `Bearer ${token}`);
      init = { ...init, headers };
    }
  }
  return originalFetch(input, init);
};

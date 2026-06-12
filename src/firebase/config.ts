'use client';

// Konfigurasi ini menggunakan variabel lingkungan Next.js.
// Jika Google Login gagal dengan 'invalid-api-key', pastikan NEXT_PUBLIC_FIREBASE_API_KEY 
// di file .env sudah diisi dengan benar dari Firebase Console.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "andra-ngelantur.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "andra-ngelantur",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "andra-ngelantur.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

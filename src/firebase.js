// src/firebase.js

// Firebase에서 필요한 함수 불러오기
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore(데이터베이스)

// Firebase에 연결할 정보
const firebaseConfig = {
  apiKey: "AIzaSyA_6xGAhATum2xSkEcLFDHCQts4vfjwnf0",
  authDomain: "jy-app-349db.firebaseapp.com",
  projectId: "jy-app-349db",
  storageBucket: "jy-app-349db.appspot.com", // 약간 수정
  messagingSenderId: "924154241435",
  appId: "1:924154241435:web:229661266a6ef1132a813e",
  measurementId: "G-J277T61926"
};

// Firebase 연결 시작
const app = initializeApp(firebaseConfig);

// ✅ Firestore 데이터베이스 연결
export const db = getFirestore(app);

// (참고) 필요하면 app도 같이 내보내기
export { app };

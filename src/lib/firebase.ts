// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function getProducts(category?: string) {
  const col = collection(db, "products");
  const q = category && category !== "すべて"
    ? query(col, where("category", "==", category), orderBy("createdAt", "desc"))
    : query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProduct(id: string) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createProduct(data: Record<string, unknown>) {
  return addDoc(collection(db, "products"), { ...data, createdAt: Timestamp.now() });
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  return updateDoc(doc(db, "products", id), { ...data, updatedAt: Timestamp.now() });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
}

export async function getCollections() {
  const snap = await getDocs(
    query(collection(db, "collections"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCollection(id: string) {
  const snap = await getDoc(doc(db, "collections", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createCollection(data: Record<string, unknown>) {
  return addDoc(collection(db, "collections"), { ...data, createdAt: Timestamp.now() });
}

export async function updateCollection(id: string, data: Record<string, unknown>) {
  return updateDoc(doc(db, "collections", id), { ...data, updatedAt: Timestamp.now() });
}

export async function deleteCollection(id: string) {
  return deleteDoc(doc(db, "collections", id));
}

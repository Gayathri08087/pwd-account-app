import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthStore } from "./authStore";

/**
 * A drop-in replacement for the old localStorage-based useStore.
 * Data is stored in Firestore under: users/{userId}/appData/{key}
 * and syncs in real-time across devices.
 */
export default function useStore(key, initialValue) {
  const user = useAuthStore((s) => s.user);
  const [data, setDataState] = useState(initialValue);
  const [ready, setReady] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid, "appData", key);

    // Subscribe to real-time updates
    unsubRef.current = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setDataState(snap.data().value ?? initialValue);
      } else {
        // First time: seed with initial value
        setDoc(docRef, { value: initialValue });
        setDataState(initialValue);
      }
      setReady(true);
    });

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key]);

  const setData = (updater) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "appData", key);

    setDataState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setDoc(docRef, { value: next });
      return next;
    });
  };

  return [data, setData, ready];
}

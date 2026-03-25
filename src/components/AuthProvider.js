'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || 'jmvalley.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only initialize Firebase on the client
    let unsubscribe;
    const init = async () => {
      const { auth } = await import('@/lib/firebase');
      const { onAuthStateChanged, signOut } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const domain = firebaseUser.email?.split('@')[1];
          if (domain !== ALLOWED_DOMAIN) {
            await signOut(auth);
            setUser(null);
            alert(`Access restricted to @${ALLOWED_DOMAIN} accounts.`);
          } else {
            setUser(firebaseUser);
            // Create default profile on first login
            const { doc, getDoc, setDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const storeRef = doc(db, 'stores', firebaseUser.uid);
            const storeDoc = await getDoc(storeRef);
            if (!storeDoc.exists()) {
              await setDoc(storeRef, {
                storeName: '',
                street: '',
                city: '',
                state: '',
                phone: '',
                operatorName: firebaseUser.displayName || '',
                operatorPhone: '',
                assistantName: '',
                assistantTitle: 'Catering Coordinator - Assistant Operator',
                assistantPhone: '',
                email: firebaseUser.email,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };
    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { auth, googleProvider } = await import('@/lib/firebase');
      const { signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      const { auth } = await import('@/lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

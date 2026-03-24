import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db, isConfigured } from '../firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    // Subscribe to total users count from Firestore in real-time
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size);
    }, (err) => {
      console.error("Error fetching users count:", err);
    });

    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // Ensure user exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase is not configured! Please add your API keys.");
    return await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email, password) => {
    if (!auth) throw new Error("Firebase is not configured! Please add your API keys.");
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (name, email, password) => {
    if (!auth) throw new Error("Firebase is not configured! Please add your API keys.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    if (name) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
    }
    
    return userCredential;
  };

  const updateUserProfile = async (displayName, photoURL) => {
    if (!auth || !currentUser) throw new Error("Not authenticated");
    
    const updateData = { displayName };
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    
    await updateProfile(currentUser, updateData);
    
    // Also update in Firestore
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, updateData, { merge: true });
    
    // Force local state update for immediate UI refresh
    setCurrentUser(auth.currentUser);
    return { user: auth.currentUser };
  };

  const logout = async () => {
    if (!auth) return;
    return await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGoogle, loginWithEmail, signUpWithEmail, logout, updateUserProfile, totalUsers }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

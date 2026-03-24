import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUserCount = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users/count`);
      if (res.ok) {
        const data = await res.json();
        setTotalUsers(data.count);
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    const session = localStorage.getItem('ideaspace_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    fetchUserCount();
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // Generate mock google data and sync with MongoDB since we don't have true API keys
    const mockUser = {
      uid: 'google-' + Date.now(),
      displayName: 'Google User',
      email: `user${Date.now()}@gmail.com`,
      photoURL: ''
    };
    
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUser)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('ideaspace_session', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else throw data;
  };

  const loginWithEmail = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('ideaspace_session', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else {
      throw data;
    }
  };

  const signUpWithEmail = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('ideaspace_session', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else {
      throw data;
    }
  };

  const updateUserProfile = async (displayName, photoURL) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: currentUser.uid, displayName, photoURL })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('ideaspace_session', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else {
      throw data;
    }
  };

  const logout = () => {
    localStorage.removeItem('ideaspace_session');
    setCurrentUser(null);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGoogle, loginWithEmail, signUpWithEmail, logout, updateUserProfile, totalUsers }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

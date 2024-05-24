'use client'
// context/authContext.js
import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '@/stores/useAuthStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [setUser, setLoading]);

  return <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

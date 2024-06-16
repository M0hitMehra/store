"use client";

import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";
import { server } from "@/lib/utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading); 

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await axios.get(`${server}/auth/user`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [setUser, setLoading]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

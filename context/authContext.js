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
    let isMounted = true;

    const checkUserLoggedIn = async () => {
      try {
        const res = await axios.get(`${server}/auth/user`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (isMounted && res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Only clear user if the backend explicitly rejected the session with 401
        // Keep persisted local user state intact if it's a cold-start timeout or offline network issue
        if (isMounted && err?.response?.status === 401) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUserLoggedIn();

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

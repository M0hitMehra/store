"use client";
// context/authContext.js
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";
import { server } from "@/lib/utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await axios.get(
          server + "/auth/user",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include this line
          }
        );
        setUser(res.data.user);
        console.log("res.data.user", res.data.user);
      } catch (err) {
        setUser(null);
        console.log("err.user", err);
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [loading, setLoading, setUser]);

  return (
    <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

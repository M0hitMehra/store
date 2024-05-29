"use client";
 // components/ProtectedRoute.js
 import { useRouter } from "next/navigation";
import { useEffect } from "react";
 import { useAuth } from "@/context/authContext";
import Loader from "./loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && isAuthenticated) {
    return children;
  }

  return null;
};

export default ProtectedRoute;

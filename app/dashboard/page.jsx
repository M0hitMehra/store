"use client";
import Loader from "@/components/loader";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";

const dashboard = () => {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return <Loader />;
  }
  return <div>dashboard</div>;
};

export default dashboard;

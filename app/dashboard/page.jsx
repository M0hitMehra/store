"use client";
import Loader from "@/components/loader";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";

const Dashboard = () => {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return <Loader />;
  }
  return <div>dashboard</div>;
};

export default Dashboard;

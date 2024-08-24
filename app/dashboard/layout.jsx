"use client";
import Loader from "@/components/loader";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return <Loader />;
  }
  return (
    <div className=" h-[88vh] w-[100vw] flex">
      <DashboardSidebar />
      <div className=" w-full overflow-y-auto lg:p-8 p-2 ">{children}</div>
    </div>
  );
};

export default DashboardLayout;

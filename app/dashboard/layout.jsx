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
    <div className="  h-full w-full flex">
      <DashboardSidebar />
      <div className=" w-full h-full overflow-y-auto   p-10 ">{children}</div>
    </div>
  );
};

export default DashboardLayout;

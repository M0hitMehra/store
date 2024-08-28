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
    <div className="  h-screen w-[100vw] flex">
      <DashboardSidebar />
      <div className=" w-full h-full overflow-y-auto lg:pt-0 pb-2 pt-28 ">{children}</div>
    </div>
  );
};

export default DashboardLayout;

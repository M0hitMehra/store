"use client"
import DashboardSidebar from "@/components/dashboard-sidebar";
import Loader from "@/components/loader";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";

const DashboardLayout = ({ children }) => {
    const { user, loading } = useProtectedRoute();

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="xl:p-0 pt-20 flex">
        <DashboardSidebar />
        <div className="ml-[16.6667%] flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

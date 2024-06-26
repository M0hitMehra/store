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
    <div>
      <div className="xl:p-0 pt-20 flex min-h-screen">
        <DashboardSidebar />
        <div className="mt-[16.6667%] md:ml-[16.6667%] md:mt-0 flex-grow bg-gradient-to-r  from-purple-600 to-indigo-600  ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

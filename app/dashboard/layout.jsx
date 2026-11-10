"use client";

import React from "react";
import Loader from "@/components/loader";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import DashboardSidebar from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col md:flex-row bg-[#fafafa]">
      <DashboardSidebar />
      <div className="flex-1 w-full pt-14 md:pt-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

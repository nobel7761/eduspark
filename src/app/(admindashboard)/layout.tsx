"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SearchProvider } from "@/context/SearchContext";
import { useState } from "react";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SearchProvider>
      <div className="flex min-h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`flex-1 ${
            isCollapsed ? "ml-16" : "ml-64"
          } transition-all duration-300`}
        >
          <Header isCollapsed={isCollapsed} />
          <main className="p-4 bg-gray-100 min-h-[90vh] mt-[10vh]">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default AdminDashboardLayout;

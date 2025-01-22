"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SearchProvider } from "@/context/SearchContext";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-4 bg-gray-100 min-h-[90vh] mt-[10vh]">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default AdminDashboardLayout;

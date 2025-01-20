"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SearchProvider } from "@/context/SearchContext";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">
            <div className="h-full border shadow-primary border-primary p-4 overflow-x-scroll overflow-y-scroll">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default AdminDashboardLayout;

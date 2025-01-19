import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <div className="h-full border shadow-black border-gray-300 rounded p-4 overflow-x-scroll overflow-y-scroll">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

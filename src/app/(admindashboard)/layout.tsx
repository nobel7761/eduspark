import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">
          <div className="h-full bg-gray-50 border shadow-black border-gray-300 rounded p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

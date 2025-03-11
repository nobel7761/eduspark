import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-500/30"
    >
      Logout
    </button>
  );
}

"use client";

import UserAvatar from "./UserAvatar";
import { loggedInUserData } from "../../../public/data/data";
import { IoCloseCircle } from "react-icons/io5";
import { useSearch } from "@/context/SearchContext";

interface HeaderProps {
  isCollapsed: boolean;
}

export default function Header({ isCollapsed }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header
      className={`h-[10vh] p-4 bg-white shadow flex items-center justify-between gap-x-4 overflow-visible fixed top-0 right-0 ${
        isCollapsed ? "left-16" : "left-64"
      } transition-all duration-300 z-40`}
    >
      <div className="text-gray-500 w-11/12 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
          >
            <IoCloseCircle size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-x-4 relative w-1/12">
        <div className="flex items-center">
          <UserAvatar user={loggedInUserData[0]} />
        </div>
      </div>
    </header>
  );
}

"use client";

import UserAvatar from "./UserAvatar";
import { loggedInUserData } from "../../../public/data/data";
import { IoNotifications } from "react-icons/io5";

export default function Header() {
  return (
    <header className="h-[10vh] p-4 bg-white shadow flex items-center justify-between gap-x-4 overflow-visible relative z-50">
      <div className="text-gray-500 w-11/12">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
        />
      </div>

      <div className="flex items-center justify-end gap-x-4 relative w-1/12">
        <span className="cursor-pointer text-3xl">
          <IoNotifications />
        </span>
        <div className="flex items-center">
          <UserAvatar user={loggedInUserData[0]} />
        </div>
      </div>
    </header>
  );
}

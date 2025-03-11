import { userDropdownItems } from "@/constants/navigation";
import { IUser } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";

interface UserAvatarProps {
  user: IUser | null;
  className?: string;
  size?: number;
}

export default function UserAvatar({
  user,
  className = "",
  size = 32,
}: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const avatarContent = user.profilePhoto ? (
    <div
      className={`relative ring-2 ring-indigo-600 rounded-full ${className}`}
      style={{ width: size, height: size }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Image
        src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
        alt={`${user.firstName} ${user.lastName}`}
        width={size}
        height={size}
        className="rounded-full object-cover cursor-pointer"
      />
    </div>
  ) : (
    <div
      className={`rounded-full bg-indigo-600 ring-2 ring-indigo-600 flex items-center justify-center text-white font-medium cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {getInitials()}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {avatarContent}

      {isOpen && (
        <div className="absolute right-0 mt-6 w-48 rounded-md shadow-lg bg-[#111827] ring-1 ring-black ring-opacity-5 z-[100]">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {userDropdownItems.map((item, index) => (
              <Link
                key={index}
                href={item.href ?? ""}
                className="block px-4 py-2 text-sm text-white hover:bg-gray-500/30"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

"use client";

import { adminNavigation } from "@/app/constants/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomDropdown from "../UI/CustomDropdown";
import Image from "next/image";
import logo from "/public/images/eduspark-logo-nobg.png";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary flex flex-col fixed h-screen">
      <div className="h-[10vh] bg-white p-4 flex items-center justify-start gap-x-2 overflow-hidden">
        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={100}
          className="w-16"
        />
        <span className="text-3xl font-extrabold text-logoColor">EduSpark</span>
      </div>

      <nav className="flex-1 text-white">
        <ul>
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <CustomDropdown items={item} pathname={pathname} />
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`p-3  cursor-pointer flex items-center ${
                      isActive ? "bg-gray-500/20" : "hover:bg-gray-500/10"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

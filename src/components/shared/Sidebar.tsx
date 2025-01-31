"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomDropdown from "../UI/CustomDropdown";
import Image from "next/image";
import logo from "/public/images/eduspark-logo-nobg.png";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { adminNavigation } from "@/constants/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-primary flex flex-col fixed h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <Link href="/" className="cursor-pointer">
        <div
          className={`h-[10vh] bg-white p-4 flex items-center ${
            isCollapsed ? "justify-center" : "justify-start gap-x-2"
          } overflow-hidden`}
        >
          <motion.div
            initial={false}
            animate={{
              width: isCollapsed ? 56 : 64,
              rotate: isCollapsed ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="text-3xl font-extrabold text-logoColor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                EduSpark
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-blue-600 text-white p-0.5 rounded-full hover:bg-blue-700 transition-colors"
      >
        {isCollapsed ? (
          <MdKeyboardArrowRight size={16} />
        ) : (
          <MdKeyboardArrowLeft size={16} />
        )}
      </button>

      <nav className="flex-1 text-white">
        <ul>
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <CustomDropdown
                    items={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                  />
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`p-3 cursor-pointer flex items-center ${
                      isActive ? "bg-gray-500/20" : "hover:bg-gray-500/10"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    {...(isCollapsed ? { title: item.name } : {})}
                  >
                    <span className={`${isCollapsed ? "text-2xl" : "mr-3"}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

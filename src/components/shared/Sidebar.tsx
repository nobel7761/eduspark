"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomDropdown, { NavigationItem } from "../UI/CustomDropdown";
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
      className={`bg-[#173F66] flex flex-col fixed h-screen transition-all duration-300 ${
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
        className="absolute -right-3 top-24 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 transition-colors"
      >
        {isCollapsed ? (
          <MdKeyboardArrowRight size={16} />
        ) : (
          <MdKeyboardArrowLeft size={16} />
        )}
      </button>

      <nav className="flex-1 text-sm text-white overflow-y-auto custom-scrollbar">
        <ul className="space-y-4 py-4">
          {adminNavigation.map((category) => (
            <li key={category.category}>
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400">
                  {category.category}
                </div>
              )}
              <ul>
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  const hasChildren =
                    "children" in item &&
                    Array.isArray(item.children) &&
                    item.children.length > 0;

                  return (
                    <li key={item.name} className="mx-2 mb-1.5">
                      {hasChildren ? (
                        <CustomDropdown
                          items={item as NavigationItem}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className={`p-3 cursor-pointer flex items-center  rounded-md ${
                            isActive
                              ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                              : "hover:bg-[#EBF5FF]/10"
                          } ${isCollapsed ? "justify-center" : ""}`}
                          {...(isCollapsed ? { title: item.name } : {})}
                        >
                          <span
                            className={`${isCollapsed ? "text-2xl" : "mr-3"}`}
                          >
                            {item.icon}
                          </span>
                          {!isCollapsed && item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

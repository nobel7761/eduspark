"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationChild {
  name: string;
  href: string;
}

export interface NavigationItem {
  name: string;
  icon: string;
  href?: string;
  children?: NavigationChild[];
}

interface CustomDropdownProps {
  items: NavigationItem;
  pathname: string;
  isCollapsed?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  pathname,
  isCollapsed,
}) => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 hover:bg-[#EBF5FF]/10 rounded-md cursor-pointer flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
        type="button"
        {...(isCollapsed ? { title: items.name } : {})}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
        >
          <span className={`${isCollapsed ? "text-2xl" : "mr-3"}`}>
            {items.icon}
          </span>
          {!isCollapsed && items.name}
        </div>
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <MdKeyboardArrowDown />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`${
              isCollapsed ? "absolute left-full top-0 ml-1 w-48" : "w-full"
            } overflow-hidden`}
          >
            <ul className="bg-[#173F66]">
              {items.children?.map((child) => (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    className={`block p-3 ${
                      isCollapsed ? "" : "pl-12"
                    }  rounded-md mx-2 my-1.5 ${
                      pathname === child.href
                        ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                        : "hover:bg-[#EBF5FF]/10"
                    }`}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;

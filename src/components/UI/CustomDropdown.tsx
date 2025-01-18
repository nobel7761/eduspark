"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationChild {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  icon: string;
  href?: string;
  children?: NavigationChild[];
}

interface CustomDropdownProps {
  items: NavigationItem;
  pathname: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items, pathname }) => {
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
        className="w-full p-3 hover:bg-gray-500/10 cursor-pointer flex items-center justify-between"
        type="button"
      >
        <div className="flex items-center">
          <span className="mr-3">{items.icon}</span>
          {items.name}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MdKeyboardArrowDown />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full overflow-hidden"
          >
            <ul className="bg-primary">
              {items.children?.map((child) => (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    className={`block p-3 pl-12 hover:bg-gray-500/10 ${
                      pathname === child.href ? "bg-gray-500/80" : ""
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

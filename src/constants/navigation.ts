export const adminNavigation = [
  {
    name: "Dashboard",
    icon: "🏠",
    href: "/",
  },
  {
    name: "Students",
    icon: "👨‍🎓",
    children: [
      { name: "All Students", href: "/students" },
      { name: "Add Student", href: "/students/create" },
    ],
  },
  {
    name: "Office Assistant",
    icon: "👨‍🏫",
    children: [
      { name: "Teachers", href: "office-assistant/teachers" },
      { name: "Bua", href: "office-assistant/bua" },
    ],
  },
  {
    name: "Class",
    icon: "🏛️",
    children: [
      { name: "All Classes", href: "/class" },
      { name: "Add Class", href: "/class/create" },
    ],
  },
  {
    name: "Routine",
    icon: "📋",
    href: "/routine",
  },
  {
    name: "Calendar",
    icon: "📅",
    href: "/calendar",
  },
  {
    name: "Accounts",
    icon: "💰",
    children: [
      { name: "Earnings", href: "/accounts/earnings" },
      { name: "Expenses", href: "/accounts/expenses" },
      { name: "Investments", href: "/accounts/investments" },
    ],
  },
  {
    name: "Management Timings",
    icon: "⏰",
    href: "/management-timings",
  },
  {
    name: "Attendance",
    icon: "📝",
    href: "/attendance",
  },
  {
    name: "Upcoming Students",
    icon: "👶",
    href: "/upcoming-students",
  },
  {
    name: "Settings",
    icon: "⚙️",
    href: "/settings",
  },
];

export const userDropdownItems = [
  { name: "My Profile", href: "/profile" },
  { name: "Logout" },
];

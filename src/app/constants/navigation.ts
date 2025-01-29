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
    name: "Teachers",
    icon: "👨‍🏫",
    children: [
      { name: "All Teachers", href: "/teachers" },
      { name: "Add Teacher", href: "/teachers/create" },
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
    ],
  },
  {
    name: "Management Hours",
    icon: "⏰",
    children: [
      { name: "Submit Timing", href: "/management-hours/submit-timing" },
      { name: "Reports", href: "/management-hours/reports" },
    ],
  },
  {
    name: "Attendance",
    icon: "📝",
    children: [
      { name: "Give Attendance", href: "/attendance/give-attendance" },
      { name: "Attendance Reports", href: "/attendance/reports" },
    ],
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

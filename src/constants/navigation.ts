export const adminNavigation = [
  {
    category: "ANALYTICS",
    items: [
      {
        name: "Dashboard",
        icon: "🏠",
        href: "/",
      },
      // {
      //   name: "Reports",
      //   icon: "📊",
      //   href: "/reports",
      // },
    ],
  },
  {
    category: "EDUCATION",
    items: [
      {
        name: "Class",
        icon: "🏛️",
        href: "/class",
      },
      {
        name: "Students",
        icon: "👨‍🎓",
        children: [
          { name: "All Students", href: "/students" },
          { name: "Add Student", href: "/students/create" },
        ],
      },
      // {
      //   name: "Routine",
      //   icon: "📋",
      //   href: "/routine",
      // },
    ],
  },
  {
    category: "EMPLOYEE MANAGEMENT",
    items: [
      {
        name: "Employees",
        icon: "👨‍🏫",
        href: "/employees",
      },
      {
        name: "Teacher Class Count",
        icon: "📝",
        href: "/teacher-class-count",
      },
    ],
  },
  // {
  //   category: "DIRECTOR MANAGEMENT",
  //   items: [
  //     {
  //       name: "Management Timings",
  //       icon: "⏰",
  //       href: "/management-timings",
  //     },
  //     {
  //       name: "Attendance",
  //       icon: "📝",
  //       href: "/attendance",
  //     },
  //   ],
  // },
  // {
  //   category: "FINANCE",
  //   items: [
  //     {
  //       name: "Accounts",
  //       icon: "💰",
  //       children: [
  //         { name: "Earnings", href: "/accounts/earnings" },
  //         { name: "Expenses", href: "/accounts/expenses" },
  //         { name: "Investments", href: "/accounts/investments" },
  //       ],
  //     },
  //   ],
  // },
];

export const userDropdownItems = [
  { name: "My Profile", href: "/profile" },
  { name: "Logout" },
];

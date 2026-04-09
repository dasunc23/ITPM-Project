import React from "react";

function Sidebar({ menuItems = [] }) {
  const defaultMenuItems = [
    { label: "Home", href: "/home" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/admin" },
    { label: "Rooms", href: "#" },
    { label: "Games Category", href: "#" },
    { label: "Achievements", href: "#" },
    { label: "Payment", href: "/payment" },
  ];

  return (
    <aside className="w-64 bg-white text-gray-900 p-6 shadow-lg min-h-screen border-r border-gray-200">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-blue-600 mb-6">Admin Panel</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {(menuItems.length ? menuItems : defaultMenuItems).map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;

import React from "react";

function Sidebar({ menuItems = [] }) {
  const defaultMenuItems = [
    { label: "Home", href: "/home" },
    { label: "Dashboard", href: "#" },
    { label: "Users", href: "/dashboard"},
    { label: "Rooms", href: "#" },
    { label: "Games Category", href: "#" },
    { label: "Achievements", href: "#" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 shadow-lg min-h-screen">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-blue-400 mb-6">Admin Panel</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {(menuItems.length ? menuItems : defaultMenuItems).map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
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

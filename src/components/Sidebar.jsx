import React from "react";

const Sidebar = ({ activeTab, setActiveTab, handleLogout, menuItems }) => {
  return (
    <aside className="w-64 bg-[#1E3A5F] text-white flex flex-col justify-between p-6 hidden md:flex shrink-0">
      <div className="space-y-8">
        <h2 className="text-2xl font-black tracking-wider text-white">
          GIGORA
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-lg transition duration-150 ${
                activeTab === item.name
                  ? "bg-[#1A56DB] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#1A56DB]/10 hover:text-white"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

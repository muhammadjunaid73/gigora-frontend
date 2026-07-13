import React, { useState } from "react";

const Sidebar = ({ activeTab, setActiveTab, handleLogout, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1E3A5F] flex items-center justify-between px-4 text-white shadow-lg z-50">
        <h2 className="text-xl font-black">GIGORA</h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl font-bold"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static
        top-0 left-0
        h-full
        w-72
        bg-[#1E3A5F]
        text-white
        flex
        flex-col
        justify-between
        p-6
        z-50
        transform
        transition-transform
        duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <div className="flex items-center justify-between mb-10 md:block">
            <h2 className="text-2xl font-black">GIGORA</h2>

            <button
              className="md:hidden text-3xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.name
                    ? "bg-[#1A56DB]"
                    : "hover:bg-[#274d74]"
                }`}
              >
                <svg
                  className="h-5 w-5 shrink-0"
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
          className="mt-8 w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;

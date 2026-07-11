import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sidebar component ko re-import kiya
import ProfileAnalyzer from "./ProfileAnalyzer";
import ProposalGenerator from "./ProposalGenerator";
import GigSEO from "./GigSEO";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const [user] = useState({
    name: "Muhammad Junaid",
    role: "Full-Stack Developer",
  });

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Profile Analyzer",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    { name: "Gig SEO", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    {
      name: "Proposal Generator",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex pb-16 md:pb-0">
      {/* Sidebar Panel Layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        menuItems={menuItems}
      />

      {/* Main Work Panel Container */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">
              {activeTab}
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              {activeTab === "Home" &&
                "Overview and access to your core workspace features."}
              {activeTab === "Profile Analyzer" &&
                "Optimize your freelancer profile analytics."}
              {activeTab === "Gig SEO" &&
                "Boost your gig visibility with optimized keywords."}
              {activeTab === "Proposal Generator" &&
                "Paste job descriptions to build winning custom proposals."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden text-sm font-bold text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </header>

        <div className="flex-1">
          {activeTab === "Home" && (
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] rounded-2xl p-6 sm:p-8 text-white shadow-lg">
              <h2 className="text-2xl sm:text-4xl font-black">
                Welcome back, {user.name}!
              </h2>
              <p className="text-sm mt-2">
                {user.role} Workspace Sub-Systems are compiled and active.
              </p>
            </div>
          )}

          {activeTab === "Profile Analyzer" && <ProfileAnalyzer />}
          {activeTab === "Gig SEO" && <GigSEO />}
          {activeTab === "Proposal Generator" && (
            <ProposalGenerator user={user} />
          )}
        </div>
      </main>

      {/* Mobile Navigation Bar UI overlay */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E3A5F] text-white flex justify-around p-2 border-t border-blue-900 shadow-xl z-50">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center p-2 text-xs transition ${
              activeTab === item.name
                ? "text-blue-300 font-bold"
                : "text-gray-400"
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
            <span className="mt-1 text-[10px]">{item.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

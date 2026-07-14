import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // --- NEW: Toast Notifications ---
import Sidebar from "../components/Sidebar";
import ProfileAnalyzer from "./ProfileAnalyzer";
import ProposalGenerator from "./ProposalGenerator";
import GigSEO from "./GigSEO";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  // --- NEW: Loading State for Skeletons ---
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: Mobile hamburger / slide-in sidebar state ---
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // --- NEW: API error state ---
  const [apiError, setApiError] = useState(null);

  // --- UPDATED: Extended User State ---
  const [user] = useState({
    name: "Muhammad Junaid",
    email: "junaid@example.com",
    role: "Full-Stack Developer",
    plan: "Free Tier",
    joinDate: "August 2025",
  });

  const [remainingUses, setRemainingUses] = useState(5);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Simulate data fetching to show skeletons
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Dashboard data loaded successfully!");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Close the mobile drawer automatically whenever a tab is selected
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const handleUseFeature = () => {
    setApiError(null);

    if (remainingUses <= 0) {
      setShowUpgradeModal(true);
      toast.error("Limit reached! Please upgrade.");
      return;
    }

    // --- NEW: Simulate an API call that can fail ---
    const apiCallSucceeds = Math.random() > 0.2; // 80% success rate for demo purposes

    if (!apiCallSucceeds) {
      setApiError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
      toast.error("Something went wrong.");
      return;
    }

    setRemainingUses((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        // Limit just got hit - surface it clearly
        setApiError(null);
        setShowUpgradeModal(true);
      }
      return next;
    });
    toast.success("Feature used successfully!");
  };

  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      type: "Proposal",
      date: "2026-07-14",
      output:
        "Hi there! I read your project description and I am confident I can build your React application with a highly scalable architecture using Tailwind CSS and Node.js...",
      metadata: { client: "John Doe", jobTitle: "React Dev Needed" },
    },
    {
      id: 2,
      type: "SEO",
      date: "2026-07-13",
      output:
        "Top keywords for your gig: React Developer, Full Stack, Frontend Web App, API Integration, Custom Website...",
      metadata: { gigTitle: "I will do full stack web development" },
    },
    {
      id: 3,
      type: "Profile",
      date: "2026-07-12",
      output:
        "Your profile score is 85%. Consider adding more portfolio items and optimizing your bio description for better visibility.",
      metadata: { score: 85 },
    },
    {
      id: 4,
      type: "Proposal",
      date: "2026-07-10",
      output: "Older proposal example text...",
      metadata: { client: "Jane Smith" },
    },
  ]);

  const [viewModalData, setViewModalData] = useState(null);

  const handleDelete = (id) => {
    setHistoryItems(historyItems.filter((item) => item.id !== id));
    toast.success("History item deleted!"); // Toast added
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Output copied to clipboard!"); // Toast added
  };

  const handleLogout = () => {
    toast("Logging out...", { icon: "👋" });
    setTimeout(() => navigate("/login"), 1000);
  };

  // --- UPDATED: Menu Items with 'My Profile' ---
  const menuItems = [
    {
      name: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "My Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    }, // New
    {
      name: "Profile Analyzer",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    { name: "Gig SEO", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    {
      name: "Proposal Generator",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    { name: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    {
      name: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const totalProposals = historyItems.filter(
    (i) => i.type === "Proposal",
  ).length;
  const totalSEO = historyItems.filter((i) => i.type === "SEO").length;
  const latestProfileObj = historyItems.find((i) => i.type === "Profile");
  const latestProfileScore = latestProfileObj
    ? latestProfileObj.metadata.score
    : 0;

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex relative">
      <Toaster position="top-right" /> {/* --- NEW: Toaster Component --- */}
      {/* Desktop sidebar - unchanged, always visible on md+ */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />
      </div>
      {/* --- NEW: Mobile hamburger sidebar drawer --- */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileSidebarOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/50 z-[190] transition-opacity duration-300 ${
          mobileSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      {/* Sliding panel */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-[200] w-72 max-w-[80%] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-[-44px] w-10 h-10 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            menuItems={menuItems}
          />
        </div>
      </div>
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
        {/* Usage Banner */}
        <div
          className={`mb-6 p-4 rounded-lg flex justify-between items-center shadow-sm border ${
            remainingUses === 0
              ? "bg-red-50 border-red-200"
              : "bg-white border-blue-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 ${remainingUses === 0 ? "text-red-500" : "text-blue-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span
              className={`font-semibold ${remainingUses === 0 ? "text-red-700" : "text-[#1E3A5F]"}`}
            >
              {remainingUses} of 5 free uses remaining today
            </span>
          </div>
          {remainingUses === 0 && (
            <button
              onClick={() => setActiveTab("Pricing")}
              className="text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-bold hover:shadow-md transition min-h-[48px] sm:min-h-0"
            >
              Upgrade Now
            </button>
          )}
        </div>

        {/* --- NEW: API Error Box --- */}
        {apiError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-bold text-red-700">Request failed</p>
                <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
                <p className="text-xs text-red-500 mt-1">
                  {remainingUses} of 5 free uses remaining today.
                </p>
              </div>
            </div>
            <button
              onClick={() => setApiError(null)}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-red-600 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            {/* --- NEW: Hamburger button (mobile only) --- */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[#1E3A5F] shadow-sm"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">
                {activeTab}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {activeTab === "Home" &&
                  "Overview and access to your core workspace features."}
                {activeTab === "My Profile" &&
                  "Manage your personal information and subscription details."}
                {activeTab === "Profile Analyzer" &&
                  "Optimize your freelancer profile analytics."}
                {activeTab === "Gig SEO" &&
                  "Boost your gig visibility with optimized keywords."}
                {activeTab === "Proposal Generator" &&
                  "Paste job descriptions to build winning custom proposals."}
                {activeTab === "History" &&
                  "View and manage your previously generated assets."}
                {activeTab === "Pricing" &&
                  "Upgrade your plan for unlimited access and pro features."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:block md:hidden text-sm font-bold text-red-600 hover:text-red-700 min-h-[48px] px-3"
          >
            Logout
          </button>
        </header>

        <div className="flex-1">
          {activeTab === "Home" && (
            <div className="space-y-8">
              {/* --- NEW: Loading Skeletons --- */}
              {isLoading ? (
                <div className="space-y-8 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-28 bg-gray-200 rounded-xl"></div>
                    <div className="h-28 bg-gray-200 rounded-xl"></div>
                    <div className="h-28 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black">
                        Welcome back, {user.name}!
                      </h2>
                      <p className="text-sm mt-2">
                        {user.role} Workspace Sub-Systems are compiled and
                        active.
                      </p>
                    </div>
                    <button
                      onClick={handleUseFeature}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-4 py-2 rounded-lg text-sm font-semibold transition min-h-[48px]"
                    >
                      Test: Simulate Tool Usage (-1)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-bold uppercase">
                        Total Proposals
                      </h3>
                      <p className="text-3xl font-black text-[#1E3A5F] mt-2">
                        {totalProposals}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-bold uppercase">
                        Total Gig SEOs
                      </h3>
                      <p className="text-3xl font-black text-[#1A56DB] mt-2">
                        {totalSEO}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-gray-500 text-sm font-bold uppercase">
                        Profile Score
                      </h3>
                      <p className="text-3xl font-black text-green-600 mt-2">
                        {latestProfileScore}%
                      </p>
                    </div>
                  </div>

                  {/* --- NEW: Quick Actions --- */}
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setActiveTab("Profile Analyzer")}
                        className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition text-left group min-h-[48px]"
                      >
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            Analyze Profile
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Get an AI audit of your freelancer profile.
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("Gig SEO")}
                        className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition text-left group min-h-[48px]"
                      >
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            Optimize Gig
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Find the best keywords for ranking.
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("Proposal Generator")}
                        className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition text-left group min-h-[48px]"
                      >
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            Write Proposal
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Generate a winning cover letter instantly.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* --- NEW: Recent History Widget --- */}
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-xl font-bold text-[#1E3A5F]">
                        Recent History
                      </h3>
                      <button
                        onClick={() => setActiveTab("History")}
                        className="text-sm font-bold text-[#1A56DB] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {historyItems.length === 0 ? (
                      <EmptyHistoryState
                        onStartGenerating={() =>
                          setActiveTab("Proposal Generator")
                        }
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                        {historyItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition"
                          >
                            <div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold mr-3 ${
                                  item.type === "Proposal"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.type === "SEO"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {item.type}
                              </span>
                              <span className="text-sm text-gray-800 font-medium truncate max-w-xs inline-block align-bottom">
                                {item.output.length > 50
                                  ? `${item.output.substring(0, 50)}...`
                                  : item.output}
                              </span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className="text-xs text-gray-400 hidden sm:block">
                                {item.date}
                              </span>
                              <button
                                onClick={() => setViewModalData(item)}
                                className="w-full sm:w-auto text-sm px-4 py-1.5 bg-[#EFF6FF] text-[#1A56DB] font-semibold rounded-lg hover:bg-blue-100 transition min-h-[48px] sm:min-h-0"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- NEW: USER PROFILE PAGE TAB --- */}
          {activeTab === "My Profile" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-100 pb-8 mb-8">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#1E3A5F] to-[#1A56DB] text-white rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-200">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[#1E3A5F]">
                      {user.name}
                    </h2>
                    <p className="text-lg text-gray-500 mt-1">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Current Plan
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold rounded-full text-sm">
                        {user.plan}
                      </span>
                      {user.plan === "Free Tier" && (
                        <button
                          onClick={() => setActiveTab("Pricing")}
                          className="text-xs font-bold text-[#1A56DB] hover:underline"
                        >
                          Upgrade
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Member Since
                    </span>
                    <span className="text-lg text-gray-800 font-semibold">
                      {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Profile Analyzer" && <ProfileAnalyzer />}
          {activeTab === "Gig SEO" && <GigSEO />}
          {activeTab === "Proposal Generator" && (
            <ProposalGenerator user={user} />
          )}

          {/* HISTORY TAB */}
          {activeTab === "History" &&
            (historyItems.length === 0 ? (
              <EmptyHistoryState
                onStartGenerating={() => setActiveTab("Proposal Generator")}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Output Preview</th>
                        <th className="p-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.type === "Proposal"
                                  ? "bg-blue-100 text-blue-700"
                                  : item.type === "SEO"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {item.date}
                          </td>
                          <td className="p-4 text-sm text-gray-700 max-w-xs truncate">
                            {item.output.length > 100
                              ? `${item.output.substring(0, 100)}...`
                              : item.output}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setViewModalData(item)}
                              className="text-sm px-3 py-2 bg-[#EFF6FF] text-[#1A56DB] font-semibold rounded hover:bg-blue-100 transition min-h-[48px] sm:min-h-0"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-sm px-3 py-2 bg-red-50 text-red-600 font-semibold rounded hover:bg-red-100 transition min-h-[48px] sm:min-h-0"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

          {/* PRICING TAB */}
          {activeTab === "Pricing" && (
            <div className="max-w-5xl mx-auto py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-[#1E3A5F]">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-gray-500 mt-4 text-lg">
                  Choose the perfect plan to accelerate your freelance business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Free Tier
                  </h3>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold text-[#1E3A5F]">
                    $0
                    <span className="ml-1 text-xl font-medium text-gray-500">
                      /mo
                    </span>
                  </div>
                  <p className="mt-4 text-gray-500">
                    Perfect for getting started and testing the tools.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "5 AI Uses per day",
                      "Standard Proposal Generation",
                      "Basic Gig SEO",
                      "Standard Profile Analysis",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled
                    className="mt-8 w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed min-h-[48px]"
                  >
                    Current Plan
                  </button>
                </div>

                <div className="bg-gradient-to-b from-[#1E3A5F] to-[#1A56DB] rounded-3xl shadow-2xl border border-blue-800 p-8 md:p-10 text-white relative transform md:-translate-y-4">
                  <div className="absolute top-0 right-6 transform -translate-y-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-100">Pro Plan</h3>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                    $15
                    <span className="ml-1 text-xl font-medium text-blue-200">
                      /mo
                    </span>
                  </div>
                  <p className="mt-4 text-blue-200">
                    Unlimited power to dominate your freelance niche.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "Unlimited AI Uses",
                      "Advanced Custom Proposals",
                      "Competitor Gig SEO Insights",
                      "Priority Email Support",
                      "Save Unlimited History",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-blue-50"
                      >
                        <svg
                          className="w-5 h-5 text-yellow-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() =>
                      toast.success("Redirecting to Stripe checkout...")
                    }
                    className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 min-h-[48px]"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* UPGRADE MODAL OVERLAY */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-[#1E3A5F]/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>

            <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>

            <h3 className="text-2xl font-black text-[#1E3A5F] mb-3">
              Limit Reached!
            </h3>
            <p className="text-gray-600 mb-2 leading-relaxed">
              You've used all 5 of your free generations for today. Upgrade to{" "}
              <strong className="text-[#1A56DB]">Pro</strong> for unlimited
              access and advanced features.
            </p>
            <p className="text-sm font-bold text-red-500 mb-6">
              {remainingUses} of 5 free uses remaining today
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition w-full sm:w-auto border border-gray-200 min-h-[48px]"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setActiveTab("Pricing");
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition w-full sm:w-auto min-h-[48px]"
              >
                View Pro Plans
              </button>
            </div>
          </div>
        </div>
      )}
      {/* VIEW MODAL OVERLAY */}
      {viewModalData && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">
                  {viewModalData.type} Result
                </h3>
                <p className="text-sm text-gray-500">{viewModalData.date}</p>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-gray-700 whitespace-pre-wrap">
              {viewModalData.output}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Metadata Details
                </h4>
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(viewModalData.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setViewModalData(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 min-h-[48px]"
              >
                Close
              </button>
              <button
                onClick={() => handleCopy(viewModalData.output)}
                className="px-4 py-2 bg-[#1E3A5F] text-white text-sm font-bold rounded-lg hover:bg-[#1A56DB] transition min-h-[48px]"
              >
                Copy Output
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- NEW: Empty state component with illustration + CTA ---
const EmptyHistoryState = ({ onStartGenerating }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center py-16 px-6">
    <svg
      className="w-32 h-32 text-[#DBEAFE] mb-6"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="90" fill="#EFF6FF" />
      <rect
        x="55"
        y="55"
        width="90"
        height="110"
        rx="8"
        fill="#FFFFFF"
        stroke="#93C5FD"
        strokeWidth="3"
      />
      <line
        x1="70"
        y1="80"
        x2="130"
        y2="80"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="70"
        y1="100"
        x2="130"
        y2="100"
        stroke="#BFDBFE"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="70"
        y1="120"
        x2="110"
        y2="120"
        stroke="#BFDBFE"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="140" cy="145" r="22" fill="#1A56DB" />
      <line
        x1="140"
        y1="134"
        x2="140"
        y2="156"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="129"
        y1="145"
        x2="151"
        y2="145"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
    <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">No history yet</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6">
      Everything you generate — proposals, gig SEO keywords, and profile audits
      — will show up here so you can find it again later.
    </p>
    <button
      onClick={onStartGenerating}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
    >
      Start Generating
    </button>
  </div>
);

export default Dashboard;

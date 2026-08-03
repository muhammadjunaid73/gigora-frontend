import React from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// PUBLIC PRICING VIEW - Shown when user is not logged in
// ✅ FIX (perf): extracted out of Dashboard.jsx so this only loads
// for logged-out visitors, via React.lazy(). Logged-in users (the
// common case once someone has an account) never fetch this chunk.
// ============================================================
const PublicPricingView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EFF6FF]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold text-[#1A56DB]"
        >
          GIGORA
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm bg-[#1A56DB] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1E3A5F] transition"
          >
            Get Started
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E3A5F]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Choose the perfect plan to accelerate your freelance business.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            👋 Sign up free to unlock the full Gigora dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
            <h3 className="text-2xl font-bold text-gray-800">Free Tier</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-[#1E3A5F]">
              $0{" "}
              <span className="ml-1 text-xl font-medium text-gray-500">
                /mo
              </span>
            </div>
            <p className="mt-4 text-gray-600">
              Perfect for getting started and testing the tools.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "5 AI Uses per day",
                "Standard Proposal Generation",
                "Basic Gig SEO",
                "Standard Profile Analysis",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700">
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
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup")}
              className="mt-8 w-full py-4 rounded-xl bg-[#1E3A5F] text-white font-bold hover:bg-[#1A56DB] transition min-h-[48px]"
            >
              Sign Up Free
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
              $15{" "}
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
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-blue-50">
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
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup")}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black hover:shadow-lg transition min-h-[48px]"
            >
              Sign Up to Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPricingView;

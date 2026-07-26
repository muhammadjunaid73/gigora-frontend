// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../App"; // Directly import the custom hook from App.jsx
// import { Menu, X } from "lucide-react"; // install: npm i lucide-react

// // Reads Pro status off `profile.plan`. Adjust this one line if your
// // backend/auth context names the field differently (e.g. `profile.isPro`).
// const ProBadge = () => (
//   <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-green-100 text-green-700 border border-green-200">
//     PRO
//   </span>
// );

// function Navbar() {
//   const { user, profile, loading, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   const displayName =
//     profile?.full_name || (user?.email ? user.email.split("@")[0] : "Guest");
//   const isProUser = profile?.plan === "pro";

//   const authSection = (
//     <div className="min-h-[36px] flex items-center">
//       {loading ? (
//         <span className="text-xs text-gray-500">Loading...</span>
//       ) : user ? (
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-semibold text-gray-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2">
//             <span className="flex items-center gap-1">👋 {displayName}</span>
//             {isProUser && <ProBadge />}
//           </span>
//           <button
//             onClick={logout}
//             className="text-xs bg-red-50 text-red-600 border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition shadow-sm"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex items-center gap-3">
//           <Link
//             to="/login"
//             className="text-sm text-indigo-600 font-semibold hover:underline"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
//           >
//             Sign Up
//           </Link>
//         </div>
//       )}
//     </div>
//   );

//   const navLinks = (
//     <>
//       <Link
//         to="/dashboard"
//         onClick={() => setIsOpen(false)}
//         className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//       >
//         Dashboard
//       </Link>

//       {authSection}
//     </>
//   );

//   return (
//     <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
//       <div className="flex justify-between items-center">
//         <Link
//           to="/"
//           className="text-xl font-bold text-indigo-600 hover:opacity-90"
//         >
//           GIGORA
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-6">{navLinks}</div>

//         {/* Mobile Hamburger */}
//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
//           aria-expanded={isOpen}
//         >
//           {isOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden mt-4 flex-col gap-4 pb-2">{navLinks}</div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App"; // Directly import the custom hook from App.jsx
import { Menu, X } from "lucide-react"; // install: npm i lucide-react

// Reads Pro status off `profile.plan`. Adjust this one line if your
// backend/auth context names the field differently (e.g. `profile.isPro`).
const ProBadge = () => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-green-100 text-green-700 border border-green-200">
    PRO
  </span>
);

function Navbar() {
  const { user, profile, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const displayName =
    profile?.full_name || (user?.email ? user.email.split("@")[0] : "Guest");
  const isProUser = profile?.plan === "pro";

  // Pricing lives inside Dashboard.jsx as a tab, not on the Landing page,
  // so this jumps straight there using the same location.state pattern
  // the payment-cancel flow already uses.
  const goToPricing = () => {
    setIsOpen(false);
    navigate("/dashboard", { state: { activeTab: "Pricing" } });
  };

  // FIX: React Router's client-side <Link to="/#features"> does NOT
  // scroll to the element — the browser only auto-scrolls to a #hash on
  // a real full-page load, not on SPA navigation. So this scrolls
  // manually:
  //  - Already on "/" → just scrollIntoView immediately.
  //  - On another page (Login/Signup) → navigate to "/" first, passing
  //    `state: { scrollTo: "features" }`; Landing.jsx picks that up on
  //    mount and scrolls once the section exists in the DOM (see the
  //    matching fix in Landing.jsx).
  const handleFeaturesClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === "/") {
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: "features" } });
    }
  };

  const authSection = (
    <div className="min-h-[36px] flex items-center">
      {loading ? (
        <span className="text-xs text-gray-500">Loading...</span>
      ) : user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2">
            <span className="flex items-center gap-1">👋 {displayName}</span>
            {isProUser && <ProBadge />}
          </span>
          <button
            onClick={logout}
            className="text-xs bg-red-50 text-red-600 border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );

  // Nav links: Features, Pricing (public marketing links) — Login/Get
  // Started (or the logged-in greeting) live in authSection below.
  const navLinks = (
    <>
      <a
        href="/#features"
        onClick={handleFeaturesClick}
        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
      >
        Features
      </a>
      <button
        onClick={goToPricing}
        className="text-gray-600 hover:text-gray-900 text-sm font-medium text-left"
      >
        Pricing
      </button>

      {authSection}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 hover:opacity-90"
        >
          GIGORA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">{navLinks}</div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-2">
          {navLinks}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
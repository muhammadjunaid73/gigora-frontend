// import { Link } from 'react-router-dom';
// import { useState } from 'react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-[#1E3A5F] sticky top-0 z-50 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">

//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <span className="text-2xl font-black text-[#FFFFFF] tracking-wider cursor-pointer">
//               GIGORA
//             </span>
//           </div>

//           {/* Desktop Nav Links */}
//           <div className="hidden md:flex space-x-8 font-medium">
//             <a href="#features" className="text-[#FFFFFF] hover:text-[#EFF6FF] transition duration-200">Features</a>
//             <a href="#pricing" className="text-[#FFFFFF] hover:text-[#EFF6FF] transition duration-200">Pricing</a>
//           </div>

//           {/* Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* ✓ Button ko Link se change kar diya */}
//             <Link to="/login" className="text-[#FFFFFF] hover:text-[#EFF6FF] font-medium transition">
//               Login
//             </Link>
//             <button className="bg-[#1A56DB] text-[#FFFFFF] px-5 py-2 rounded-md font-medium hover:bg-[#1E3A5F] transition duration-200 shadow-md">
//               Get Started
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex md:hidden">
//             <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-[#FFFFFF] hover:text-[#EFF6FF] focus:outline-none">
//               {isOpen ? (
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//               ) : (
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
//               )}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-[#1E3A5F] border-t border-[#EFF6FF] px-2 pt-2 pb-4 space-y-1">
//           <a href="#features" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[#FFFFFF] hover:bg-[#1A56DB]">Features</a>
//           <a href="#pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[#FFFFFF] hover:bg-[#1A56DB]">Pricing</a>
//           <div className="pt-4 border-t border-[#EFF6FF] flex flex-col space-y-2 px-3">
//             {/* ✓ Mobile view ke button ko bhi Link se change kar diya */}
//             <Link to="/login" onClick={() => setIsOpen(false)} className="text-[#FFFFFF] hover:text-[#EFF6FF] font-medium text-left">
//               Login
//             </Link>
//             <button className="w-full bg-[#1A56DB] text-[#FFFFFF] px-4 py-2 rounded-md font-medium hover:bg-[#1E3A5F] transition">
//               Get Started
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App"; // Directly import the custom hook from App.jsx
import { Menu, X } from "lucide-react"; // install: npm i lucide-react

function Navbar() {
  const { user, profile, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    profile?.full_name || (user?.email ? user.email.split("@")[0] : "Guest");

  const navLinks = (
    <>
      <Link
        to="/dashboard"
        onClick={() => setIsOpen(false)}
        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
      >
        Dashboard
      </Link>

      {loading ? (
        <span className="text-xs text-gray-400">Loading...</span>
      ) : user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1">
            👋 {displayName}
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
            className="text-sm text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
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
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 flex-col gap-4 pb-2">{navLinks}</div>
      )}
    </nav>
  );
}

export default Navbar;
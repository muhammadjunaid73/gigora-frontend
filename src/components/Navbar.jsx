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
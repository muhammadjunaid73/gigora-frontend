import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <div className="text-7xl mb-6">🧭</div>
        <h1 className="text-3xl font-black text-[#1E3A5F] mb-3">
          Oops! Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";

const LoadingSpinner = ({ message = "AI is processing your request..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
      {/* Outer Glow Ring */}
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#1A56DB]"></div>
        {/* Inner static branding dot */}
        <div className="absolute h-4 w-4 bg-[#1E3A5F] rounded-full animate-pulse"></div>
      </div>

      {/* Dynamic Text Messages */}
      <div className="text-center space-y-1">
        <p className="text-sm font-black text-[#111827] tracking-wide animate-pulse">
          {message}
        </p>
        <p className="text-xs text-[#6B7280]">
          Please wait,calculating optimization parameters.
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

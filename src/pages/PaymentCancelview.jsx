import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const REDIRECT_SECONDS = 6;

// ============================================================
// PAYMENT CANCEL VIEW - Shown when user cancels checkout
// ✅ FIX (perf): extracted out of Dashboard.jsx so this only loads
// when someone actually lands on /payment/cancel, via React.lazy().
// ============================================================
const PaymentCancelView = ({ onBack, onDashboard }) => {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!hasNotified.current) {
      hasNotified.current = true;
      toast("Checkout cancelled — no charge was made.", { icon: "ℹ️" });
    }
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onBack();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onBack]);

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-8 md:p-10 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
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
        </div>
        <h1 className="text-2xl font-black text-[#1E3A5F] mb-3">
          Checkout Cancelled
        </h1>
        <p className="text-gray-600 leading-relaxed mb-2">
          No worries — you weren't charged. You can pick back up whenever you're
          ready to upgrade.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Redirecting to Pricing in {secondsLeft}s...
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
          >
            Back to Pricing
          </button>
          <button
            onClick={onDashboard}
            className="w-full py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition min-h-[48px] border border-gray-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelView;

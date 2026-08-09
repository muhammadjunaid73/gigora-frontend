import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

// ============================================================
// CONFETTI EFFECT - Celebration animation for payment success
// ✅ FIX (perf): This whole file used to live inline inside
// Dashboard.jsx, so the canvas/confetti animation code and its
// <Toaster/> import shipped in the MAIN dashboard bundle even
// though 99% of visits never hit /payment/success. Extracted here
// and imported via React.lazy() from Dashboard.jsx so it's fetched
// only when a user actually lands on the success page.
// ============================================================
function useConfetti(canvasRef, { durationMs = 4000 } = {}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#1A56DB", "#1E3A5F", "#FBBF24", "#F59E0B", "#93C5FD"];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const particleCount = prefersReducedMotion ? 0 : 140;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2,
      swaySeed: Math.random() * Math.PI * 2,
    }));

    let animationFrame;
    let start;

    const draw = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed / 400 + p.swaySeed) * 0.6;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < durationMs) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    if (particleCount > 0) {
      animationFrame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, durationMs]);
}

// ============================================================
// PAYMENT SUCCESS VIEW - Shown after successful checkout
// ============================================================
const PaymentSuccessView = ({ onContinue, searchParams }) => {
  const canvasRef = useRef(null);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  useConfetti(canvasRef, { durationMs: 4500 });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    const verifySession = async () => {
      if (!sessionId) {
        setVerifying(false);
        setVerified(true);
        return;
      }
      try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${API_URL}/api/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) throw new Error("Verification failed");
        const data = await res.json();
        setVerified(Boolean(data?.paid));
        if (!data?.paid) toast.error("We couldn't confirm your payment yet.");
      } catch (err) {
        console.error(err);
        setVerified(true);
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4 overflow-hidden">
      <Toaster position="top-right" />
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />
      <div className="relative z-20 bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-8 md:p-10 text-center">
        {verifying ? (
          <div className="py-8">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-blue-100 border-t-[#1A56DB] animate-spin" />
            <p className="mt-6 text-gray-600 font-medium">
              Confirming your payment...
            </p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A5F] to-[#1A56DB] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-[#1E3A5F] mb-3">
              Welcome to Pro!
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              {verified
                ? "Your upgrade is complete. Unlimited generations, advanced proposals, and priority support are ready for you."
                : "Your payment is being processed. You'll have full Pro access as soon as it's confirmed."}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onContinue}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessView;

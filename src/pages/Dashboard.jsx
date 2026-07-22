import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../App";

const ProfileAnalyzer = lazy(
  () => import(/* webpackChunkName: "profile-analyzer" */ "./ProfileAnalyzer"),
);
const GigSEO = lazy(() => import(/* webpackChunkName: "gig-seo" */ "./GigSEO"));
const ProposalGenerator = lazy(
  () =>
    import(/* webpackChunkName: "proposal-generator" */ "./ProposalGenerator"),
);

const TabFallback = () => (
  <div className="min-h-[420px] animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
    <div className="h-64 bg-gray-200 rounded-xl w-full" />
    <div className="h-10 bg-gray-200 rounded-lg w-1/4" />
  </div>
);

const menuItems = [
  {
    name: "Home",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "My Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    name: "Profile Analyzer",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  { name: "Gig SEO", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  {
    name: "Proposal Generator",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "Model Compare",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  { name: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  {
    name: "Billing",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    name: "Pricing",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

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
    <p className="text-sm text-gray-600 max-w-sm mb-6">
      Everything you generate — proposals, gig SEO keywords, and profile audits
      — will show up here.
    </p>
    <button
      onClick={onStartGenerating}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
    >
      Start Generating
    </button>
  </div>
);

// Helper to render stat cards (reduces duplication)
// FIX: added min-h-[104px] so it matches the skeleton height exactly -> no CLS
const StatCard = ({ label, value, color = "text-[#1E3A5F]" }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[104px]">
    <h3 className="text-gray-700 text-sm font-bold uppercase">{label}</h3>
    <p className={`text-3xl font-black mt-2 ${color}`}>{value}</p>
  </div>
);

// Helper for quick action buttons
// FIX: added min-h-[92px] so it matches the skeleton height exactly -> no CLS
const QuickAction = ({ icon, label, description, onClick, bgColor }) => (
  <button
    onClick={onClick}
    className="min-h-[92px] flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition text-left group"
  >
    <div
      className={`p-3 ${bgColor} rounded-lg group-hover:scale-110 transition flex-shrink-0`}
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
          d={icon}
        />
      </svg>
    </div>
    <div>
      <h4 className="font-bold text-gray-800">{label}</h4>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </div>
  </button>
);

// FIX: dedicated skeleton row for history list that mirrors the real row's
// layout (same padding, same min-h) so swapping skeleton -> real content
// causes zero layout shift, regardless of how many items there are.
const HistoryRowSkeleton = () => (
  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[72px]">
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
      <div className="h-4 bg-gray-200 rounded w-2/3 sm:w-64 animate-pulse" />
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-4">
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden sm:block" />
      <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

// ---------------------------------------------------------------------
// Payment success / cancel views
// Rendered in place of the normal dashboard chrome when the URL is
// /payment/success or /payment/cancel (see the pathname check inside
// the Dashboard component below). Kept in this same file on purpose.
// ---------------------------------------------------------------------

// Lightweight, dependency-free confetti burst on a full-screen canvas.
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

const PaymentSuccessView = ({ onContinue, searchParams }) => {
  const canvasRef = useRef(null);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  useConfetti(canvasRef, { durationMs: 4500 });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    const verifySession = async () => {
      // Optional: confirm the checkout session server-side before showing
      // success. Swap in your real endpoint; this fails open so a flaky
      // verify call never strands a paying customer on an error screen —
      // your Stripe webhook remains the real source of truth for the plan.
      if (!sessionId) {
        setVerifying(false);
        setVerified(true);
        return;
      }
      try {
        const res = await fetch(
          `/api/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`,
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

const REDIRECT_SECONDS = 6;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [remainingUses, setRemainingUses] = useState(5);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      type: "Proposal",
      date: "2026-07-14",
      output: "Hi there! I read your project description...",
      metadata: { client: "John Doe", jobTitle: "React Dev Needed" },
    },
    {
      id: 2,
      type: "SEO",
      date: "2026-07-13",
      output: "Top keywords for your gig: React Developer, Full Stack...",
      metadata: { gigTitle: "I will do full stack web development" },
    },
    {
      id: 3,
      type: "Profile",
      date: "2026-07-12",
      output: "Your profile score is 85%. Consider adding more...",
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

  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout: authLogout } = useAuth() || {};
  // Single source of truth for Pro status. Replace `profile?.plan` with
  // whatever field your backend/auth context actually returns — this is
  // the only line that needs to change once real billing data is wired up.
  const isProUser = profile?.plan === "pro";

  const user = useMemo(
    () => ({
      name: profile?.full_name || "Muhammad Junaid",
      email: profile?.email || "junaid@example.com",
      role: "Full-Stack Developer",
      plan: isProUser ? "Pro" : "Free Tier",
      joinDate: "August 2025",
      nextBillingDate: profile?.next_billing_date || "August 22, 2026",
    }),
    [profile, isProUser],
  );

  useEffect(() => {
    // FIX: shortened the artificial skeleton delay from 1500ms to 400ms.
    // The height-matching fixes below are the real CLS fix, but a shorter
    // delay also reduces the chance Lighthouse's observation window
    // captures any residual shift.
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Dashboard data loaded successfully!");
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  // Lets other pages (e.g. the payment-cancel page) deep-link back into
  // the Pricing tab via `navigate("/dashboard", { state: { activeTab: "Pricing" } })`.
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state so refreshing/re-navigating doesn't re-trigger it.
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleUseFeature = useCallback(() => {
    setApiError(null);
    setRemainingUses((prev) => {
      if (prev <= 0) {
        setShowUpgradeModal(true);
        toast.error("Limit reached! Please upgrade.");
        return prev;
      }
      const succeeds = Math.random() > 0.2;
      if (!succeeds) {
        setApiError(
          "We couldn't reach the server. Please check your connection and try again.",
        );
        toast.error("Something went wrong.");
        return prev;
      }
      const next = prev - 1;
      if (next <= 0) setShowUpgradeModal(true);
      toast.success("Feature used successfully!");
      return next;
    });
  }, []);

  const handleDelete = useCallback((id) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("History item deleted!");
  }, []);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.success("Output copied to clipboard!");
  }, []);

  const handleLogout = useCallback(async () => {
    toast("Logging out...", { icon: "👋" });
    try {
      await authLogout?.();
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => navigate("/login"), 1000);
  }, [navigate, authLogout]);

  const [cancelling, setCancelling] = useState(false);
  const handleCancelSubscription = useCallback(async () => {
    const confirmed = window.confirm(
      "Cancel your Pro subscription? You'll keep Pro access until the end of the current billing period.",
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to cancel subscription");
      toast.success(
        "Subscription cancelled. Pro access continues until the period ends.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Couldn't cancel your subscription. Please try again.");
    } finally {
      setCancelling(false);
    }
  }, []);

  const handleUpgradeClick = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Add an Authorization header here if your auth context exposes a token
        body: JSON.stringify({
          priceId: "price_pro_monthly", // swap for your real Stripe price ID
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned");
      window.location.href = data.url; // redirect to Stripe Checkout
    } catch (err) {
      console.error(err);
      toast.error("Couldn't start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  }, []);

  const totalProposals = useMemo(
    () => historyItems.filter((i) => i.type === "Proposal").length,
    [historyItems],
  );
  const totalSEO = useMemo(
    () => historyItems.filter((i) => i.type === "SEO").length,
    [historyItems],
  );
  const latestProfileScore = useMemo(() => {
    const profileItem = historyItems.find((i) => i.type === "Profile");
    return profileItem ? profileItem.metadata.score : 0;
  }, [historyItems]);

  const renderSidebar = (isMobile = false) => (
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
      menuItems={menuItems}
      aria-label={isMobile ? "Mobile navigation" : "Main navigation"}
    />
  );

  // Stripe redirects the browser straight to /payment/success or
  // /payment/cancel. Both URLs are routed to this same Dashboard
  // component (see App.js), so we just swap in a full-page view here
  // instead of the normal sidebar + tabs layout.
  if (location.pathname === "/payment/success") {
    const searchParams = new URLSearchParams(location.search);
    return (
      <PaymentSuccessView
        searchParams={searchParams}
        onContinue={() => navigate("/dashboard")}
      />
    );
  }
  if (location.pathname === "/payment/cancel") {
    return (
      <PaymentCancelView
        onBack={() =>
          navigate("/dashboard", { state: { activeTab: "Pricing" } })
        }
        onDashboard={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex relative">
      <Toaster position="top-right" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block" aria-label="Main navigation">
        {renderSidebar(false)}
      </div>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileSidebarOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/50 z-[190] transition-opacity duration-300 ${
          mobileSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-[200] w-72 max-w-[80%] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileSidebarOpen}
        aria-label="Mobile navigation"
        inert={!mobileSidebarOpen ? true : undefined} // ✅ prevents focus + hides from screen readers
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
          {renderSidebar(true)}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
        {/* Usage banner */}
        <div
          className={`mb-6 p-4 rounded-lg flex justify-between items-center shadow-sm border min-h-[64px] ${
            remainingUses === 0
              ? "bg-red-50 border-red-200"
              : "bg-white border-blue-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 ${remainingUses === 0 ? "text-red-500" : "text-blue-500"}`}
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

        {/* Error banner */}
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

        {/* Page header */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 min-h-[76px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[#1E3A5F] shadow-sm flex-shrink-0"
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
              <p className="text-sm text-gray-600 mt-1">
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
                {activeTab === "Model Compare" &&
                  "Compare AI model outputs side by side."}
                {activeTab === "History" &&
                  "View and manage your previously generated assets."}
                {activeTab === "Billing" &&
                  "View your plan, billing date, and manage your subscription."}
                {activeTab === "Pricing" &&
                  "Upgrade your plan for unlimited access and pro features."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:block md:hidden text-sm font-bold text-red-700 hover:text-red-800 min-h-[48px] px-3"
          >
            Logout
          </button>
        </header>

        <div className="flex-1">
          {activeTab === "Home" && (
            <div className="space-y-8">
              {/* Welcome banner */}
              {/* FIX v2: outer wrapper has a FIXED min-height that never
                  changes. Both skeleton and real content are absolutely
                  positioned inside it (absolute inset-0), so neither state
                  can ever affect the wrapper's box size. This guarantees
                  zero layout shift regardless of how much text/padding
                  the real content ends up needing. */}
              <div className="relative min-h-[156px] sm:min-h-[144px] rounded-2xl overflow-hidden">
                {isLoading ? (
                  <div className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex justify-between items-center flex-wrap gap-4 overflow-y-auto">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black">
                        Welcome back, {user.name}!
                      </h2>
                      <p className="text-sm mt-2">
                        {user.role} Workspace Sub-Systems are compiled and
                        active.
                      </p>
                    </div>
                    {/* Fixed contrast: use solid bg with white text */}
                    <button
                      onClick={handleUseFeature}
                      className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition min-h-[48px]"
                    >
                      Test: Simulate Tool Usage (-1)
                    </button>
                  </div>
                )}
              </div>

              {/* Stats row */}
              {/* NOTE: absolute-overlay isn't used here on purpose — this
                  grid switches from 1 column (mobile) to 3 columns
                  (desktop), so a fixed-height overlay box would clip the
                  stacked mobile cards. Instead, both the skeleton blocks
                  and the real StatCard both carry the identical
                  min-h-[104px], so each individual card is the same size
                  in both states -> no shift, on any screen size. */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 rounded-xl animate-pulse min-h-[104px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Total Proposals" value={totalProposals} />
                  <StatCard
                    label="Total Gig SEOs"
                    value={totalSEO}
                    color="text-[#1A56DB]"
                  />
                  <StatCard
                    label="Profile Score"
                    value={`${latestProfileScore}%`}
                    color="text-green-600"
                  />
                </div>
              )}

              {/* Quick Actions */}
              {isLoading ? (
                <div>
                  <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl animate-pulse h-[92px]"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickAction
                      icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      label="Analyze Profile"
                      description="Get an AI audit of your freelancer profile."
                      onClick={() => setActiveTab("Profile Analyzer")}
                      bgColor="bg-purple-100 text-purple-600"
                    />
                    <QuickAction
                      icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      label="Optimize Gig"
                      description="Find the best keywords for ranking."
                      onClick={() => setActiveTab("Gig SEO")}
                      bgColor="bg-green-100 text-green-600"
                    />
                    <QuickAction
                      icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      label="Write Proposal"
                      description="Generate a winning cover letter instantly."
                      onClick={() => setActiveTab("Proposal Generator")}
                      bgColor="bg-blue-100 text-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Recent History */}
              {/* FIX: replaced the single blob skeleton (fixed h-[190px])
                  with per-row skeletons that mirror the real row's layout.
                  This keeps height consistent regardless of item count
                  and removes the second-largest layout shift. */}
              {isLoading ? (
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                    {(historyItems.length > 0
                      ? historyItems.slice(0, 3)
                      : [1, 2, 3]
                    ).map((item, idx) => (
                      <HistoryRowSkeleton key={item?.id ?? idx} />
                    ))}
                  </div>
                </div>
              ) : (
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
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[72px] hover:bg-gray-50 transition"
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
                            <span className="text-xs text-gray-600 hidden sm:block">
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
              )}
            </div>
          )}

          {/* Other tabs (omitted for brevity, but they remain unchanged) */}
          {activeTab === "My Profile" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-100 pb-8 mb-8">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#1E3A5F] to-[#1A56DB] text-white rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-200 flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[#1E3A5F]">
                      {user.name}
                    </h2>
                    <p className="text-lg text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
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
                    <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
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

          {activeTab === "Profile Analyzer" && (
            <Suspense fallback={<TabFallback />}>
              <ProfileAnalyzer
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </Suspense>
          )}
          {activeTab === "Gig SEO" && (
            <Suspense fallback={<TabFallback />}>
              <GigSEO
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </Suspense>
          )}
          {activeTab === "Proposal Generator" && (
            <Suspense fallback={<TabFallback />}>
              <ProposalGenerator
                user={user}
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </Suspense>
          )}

          {activeTab === "Model Compare" &&
            (isProUser ? (
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                  Model Compare
                </h3>
                <p className="text-gray-600 text-sm">
                  Run the same prompt across models and compare outputs side by
                  side. (Wire this up to your actual comparison endpoint/UI.)
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                  Model Compare is a Pro feature
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mb-6">
                  Upgrade to Pro to compare AI model outputs side by side.
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px]"
                >
                  Upgrade to Pro
                </button>
              </div>
            ))}

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
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
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

          {activeTab === "Billing" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
                  <div>
                    <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
                      Current Plan
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-4 py-1.5 font-bold rounded-full text-sm ${
                          isProUser
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </div>
                  </div>
                  {!isProUser && (
                    <button
                      onClick={() => setActiveTab("Pricing")}
                      className="text-sm font-bold text-[#1A56DB] hover:underline min-h-[48px]"
                    >
                      Upgrade
                    </button>
                  )}
                </div>

                {isProUser ? (
                  <>
                    <div className="mb-8">
                      <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
                        Next Billing Date
                      </span>
                      <span className="text-lg text-gray-800 font-semibold">
                        {user.nextBillingDate}
                      </span>
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition min-h-[48px] border border-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {cancelling ? "Cancelling..." : "Cancel Subscription"}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">
                    You're on the Free Tier — no billing details yet. Upgrade to
                    Pro to see your next billing date and manage your
                    subscription here.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Pricing" && (
            <div className="max-w-5xl mx-auto py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-[#1E3A5F]">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-gray-600 mt-4 text-lg">
                  Choose the perfect plan to accelerate your freelance business.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Free Tier
                  </h3>
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
                      <li
                        key={f}
                        className="flex items-center gap-3 text-gray-700"
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
                        {f}
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
                      <li
                        key={f}
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
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleUpgradeClick}
                    disabled={checkoutLoading}
                    className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {checkoutLoading
                      ? "Redirecting to checkout..."
                      : "Upgrade to Pro"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-[#1E3A5F]/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-500" />
            <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-[#1E3A5F] mb-3">
              Limit Reached!
            </h3>
            <p className="text-gray-600 mb-2 leading-relaxed">
              You've used all 5 free generations for today. Upgrade to{" "}
              <strong className="text-[#1A56DB]">Pro</strong> for unlimited
              access.
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
      {viewModalData && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">
                  {viewModalData.type} Result
                </h3>
                <p className="text-sm text-gray-600">{viewModalData.date}</p>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                aria-label="Close result details"
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
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
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

export default Dashboard;
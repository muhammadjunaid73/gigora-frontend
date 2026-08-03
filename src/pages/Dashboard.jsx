import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Suspense,
  lazy,
  startTransition,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { useAuth, getSupabase } from "../App";

// ============================================================
// PERFORMANCE: Preload critical resources
// ============================================================
const preloadSupabase = () => {
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href =
    process.env.REACT_APP_SUPABASE_URL || "https://your-project.supabase.co";
  document.head.appendChild(link);
};

if (typeof window !== "undefined") {
  preloadSupabase();
}

// ============================================================
// LAZY LOADING
// ============================================================
const ProfileAnalyzer = lazy(() => import("./ProfileAnalyzer"));
const GigSEO = lazy(() => import("./GigSEO"));
const ProposalGenerator = lazy(() => import("./ProposalGenerator"));
const ModelCompare = lazy(() => import("./ModelCompare"));
const PaymentSuccessView = lazy(() => import("./PaymentSuccessview"));
const PaymentCancelView = lazy(() => import("./PaymentCancelview"));
const PublicPricingView = lazy(() => import("./PublicPricingview"));

const Toaster = lazy(() =>
  import("react-hot-toast").then((mod) => ({ default: mod.Toaster })),
);

// ============================================================
// SVG ICONS
// ============================================================
const SVG_ICONS = {
  MENU: "M4 6h16M4 12h16M4 18h16",
  CLOSE: "M6 18L18 6M6 6l12 12",
  HOME: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  PROFILE:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  ANALYZER:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  SEARCH: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  PROPOSAL:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  COMPARE:
    "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
  HISTORY: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  BILLING:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  PRICING:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  LIGHTNING: "M13 10V3L4 14h7v7l9-11h-7z",
  ERROR:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  CHECK: "M5 13l4 4L19 7",
  CAMERA:
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  LOCK: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  STAR: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
};

const Icon = React.memo(
  ({ name, className = "w-6 h-6", strokeWidth = 2, ...props }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d={SVG_ICONS[name]}
      />
    </svg>
  ),
);

Icon.displayName = "Icon";

// ============================================================
// LOADING STATES
// ============================================================
const LOADING_STATES = {
  TAB: React.memo(() => (
    <div className="min-h-[420px] animate-pulse space-y-4 p-4">
      <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
      <div className="h-64 bg-gray-200 rounded-xl w-full" />
      <div className="h-10 bg-gray-200 rounded-lg w-1/4" />
    </div>
  )),
  FULL_SCREEN: React.memo(() => (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#1A56DB] animate-spin" />
    </div>
  )),
  SKELETON: React.memo(() => (
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
  )),
};

LOADING_STATES.TAB.displayName = "TabFallback";
LOADING_STATES.FULL_SCREEN.displayName = "FullScreenFallback";
LOADING_STATES.SKELETON.displayName = "SkeletonLoader";

const MENU_ITEMS = [
  { name: "Home", hash: "home", icon: SVG_ICONS.HOME },
  { name: "My Profile", hash: "profile", icon: SVG_ICONS.PROFILE },
  {
    name: "Profile Analyzer",
    hash: "profile-analyzer",
    icon: SVG_ICONS.ANALYZER,
  },
  { name: "Gig SEO", hash: "gig-seo", icon: SVG_ICONS.SEARCH },
  {
    name: "Proposal Generator",
    hash: "proposal-generator",
    icon: SVG_ICONS.PROPOSAL,
  },
  { name: "Model Compare", hash: "model-compare", icon: SVG_ICONS.COMPARE },
  { name: "History", hash: "history", icon: SVG_ICONS.HISTORY },
  { name: "Billing", hash: "billing", icon: SVG_ICONS.BILLING },
  { name: "Pricing", hash: "pricing", icon: SVG_ICONS.PRICING },
];

const MAX_AVATAR_DIMENSION = 512;

// ============================================================
// ✅ FIXED: API URL HELPER - Properly sanitized
// ============================================================
const getApiUrl = (endpoint) => {
  // Get base URL and sanitize it
  let baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // Remove any semicolons, trailing slashes, or whitespace
  baseUrl = baseUrl.replace(/[;]+/g, "").replace(/\/+$/, "").trim();

  // Remove leading slash from endpoint if exists
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  // Construct full URL
  return `${baseUrl}/${cleanEndpoint}`;
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getTabFromHash = (hash) => {
  if (!hash) return "Home";
  const cleanHash = hash.replace("#", "").toLowerCase();
  const match = MENU_ITEMS.find(
    (item) => item.hash?.toLowerCase() === cleanHash,
  );
  return match ? match.name : "Home";
};

const compressImageToWebP = async (
  file,
  maxDimension = MAX_AVATAR_DIMENSION,
  quality = 0.85,
) => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", quality),
  );

  return blob || file;
};

// ============================================================
// SUB-COMPONENTS
// ============================================================
const EmptyHistoryState = React.memo(({ onStartGenerating }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center py-16 px-6">
    <svg
      className="w-32 h-32 text-[#DBEAFE] mb-6"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      loading="lazy"
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
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Start generating content"
    >
      Start Generating
    </button>
  </div>
));

EmptyHistoryState.displayName = "EmptyHistoryState";

const StatCard = React.memo(({ label, value, color = "text-[#1E3A5F]" }) => (
  <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[104px]">
    <h3 className="text-gray-700 text-sm font-bold uppercase">{label}</h3>
    <p className={`text-3xl font-black mt-2 ${color}`}>{value}</p>
  </article>
));

StatCard.displayName = "StatCard";

const QuickAction = React.memo(
  ({ icon, label, description, onClick, bgColor }) => (
    <button
      onClick={onClick}
      className="min-h-[92px] flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition text-left group w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label={`${label}: ${description}`}
    >
      <div
        className={`p-3 ${bgColor} rounded-lg group-hover:scale-110 transition flex-shrink-0`}
      >
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-sm sm:text-base">
          {label}
        </h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </button>
  ),
);

QuickAction.displayName = "QuickAction";

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() =>
    getTabFromHash(window.location.hash),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [remainingUses, setRemainingUses] = useState(5);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [viewModalData, setViewModalData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const supabaseRef = useRef(null);
  const dataLoadedRef = useRef(false);
  const initialRenderRef = useRef(true);

  // ============================================================
  // AUTHENTICATION
  // ============================================================
  const {
    user: authUser,
    profile,
    loading: authLoading,
    logout: authLogout,
  } = useAuth() || {};

  const isProUser = profile?.plan === "pro";

  // ============================================================
  // MEMOIZED USER
  // ============================================================
  const user = useMemo(
    () => ({
      name: profile?.full_name || authUser?.email?.split("@")[0] || "User",
      email: authUser?.email || "",
      role: profile?.role || "Freelancer",
      plan: isProUser ? "Pro" : "Free Tier",
      joinDate: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Recent",
      nextBillingDate: profile?.next_billing_date || "N/A",
      avatarUrl: profile?.avatar_url || null,
    }),
    [
      profile?.full_name,
      profile?.role,
      profile?.created_at,
      profile?.next_billing_date,
      profile?.avatar_url,
      authUser?.email,
      isProUser,
    ],
  );

  // ============================================================
  // HASH CHANGE HANDLER
  // ============================================================
  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        setActiveTab(getTabFromHash(window.location.hash));
      });
    };

    window.addEventListener("hashchange", handleHashChange, { passive: true });
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // ============================================================
  // TAB CHANGE HANDLER
  // ============================================================
  const handleTabChange = useCallback((tabName) => {
    startTransition(() => {
      setActiveTab(tabName);
      setMobileSidebarOpen(false);
    });

    const menuItem = MENU_ITEMS.find((item) => item.name === tabName);
    const newHash = menuItem?.hash ? `#${menuItem.hash}` : "";

    if (window.location.hash !== newHash) {
      window.history.pushState(null, "", newHash || window.location.pathname);
    }
  }, []);

  // ============================================================
  // DATA LOADING
  // ============================================================
  useEffect(() => {
    if (!authUser?.id) {
      setIsLoading(false);
      return;
    }

    if (dataLoadedRef.current) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const loadDashboardData = async () => {
      try {
        const supabase = await getSupabase();
        if (cancelled) return;

        supabaseRef.current = supabase;
        const today = new Date().toISOString().split("T")[0];

        const [usageResult, historyResult] = await Promise.all([
          supabase
            .from("ai_usage")
            .select("id")
            .eq("user_id", authUser.id)
            .eq("date", today),
          supabase
            .from("history")
            .select("*")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false })
            .limit(50),
        ]);

        if (cancelled) return;

        if (!usageResult.error) {
          const usedToday = usageResult.data?.length || 0;
          setRemainingUses(
            isProUser ? "Unlimited" : Math.max(0, 5 - usedToday),
          );
        }

        if (!historyResult.error && historyResult.data) {
          const formattedHistory = historyResult.data.map((item) => ({
            id: item.id,
            type: item.type,
            date: new Date(item.created_at).toISOString().split("T")[0],
            output:
              typeof item.output === "string"
                ? item.output
                : JSON.stringify(item.output),
            metadata: item.metadata || {},
          }));
          setHistoryItems(formattedHistory);
        }

        dataLoadedRef.current = true;
        initialRenderRef.current = false;
        toast.success("Dashboard ready", { duration: 2000 });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (!cancelled) toast.error("Couldn't load some dashboard data");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(loadDashboardData, 50);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
      const supabase = supabaseRef.current;
      if (supabase?.getChannels) {
        supabase.getChannels().forEach((channel) => {
          supabase.removeChannel(channel);
        });
      }
    };
  }, [authUser?.id, isProUser]);

  useEffect(() => {
    if (!initialRenderRef.current && dataLoadedRef.current) {
      const today = new Date().toISOString().split("T")[0];
      const usedToday = historyItems.filter(
        (item) => item.date === today,
      ).length;
      setRemainingUses(isProUser ? "Unlimited" : Math.max(0, 5 - usedToday));
    }
  }, [isProUser, historyItems]);

  // ============================================================
  // CALLBACKS
  // ============================================================
  const trackUsage = useCallback(
    async (usageType) => {
      if (!authUser?.id) return false;

      try {
        const supabase = await getSupabase();
        const today = new Date().toISOString().split("T")[0];

        const { data: usageData } = await supabase
          .from("ai_usage")
          .select("id")
          .eq("user_id", authUser.id)
          .eq("date", today);

        const usedToday = usageData?.length || 0;

        if (!isProUser && usedToday >= 5) {
          setRemainingUses(0);
          setShowUpgradeModal(true);
          toast.error(
            "Daily limit reached! Upgrade to Pro for unlimited access.",
          );
          return false;
        }

        const { error: insertError } = await supabase.from("ai_usage").insert({
          user_id: authUser.id,
          usage_type: usageType,
          date: today,
        });

        if (insertError) throw insertError;

        setRemainingUses(
          isProUser ? "Unlimited" : Math.max(0, 5 - (usedToday + 1)),
        );
        return true;
      } catch (err) {
        console.error("Failed to track usage:", err);
        return true;
      }
    },
    [authUser?.id, isProUser],
  );

  const refreshDashboard = useCallback(async () => {
    if (!authUser?.id) return;

    try {
      const supabase = await getSupabase();
      const today = new Date().toISOString().split("T")[0];

      const [historyResult, usageResult] = await Promise.all([
        supabase
          .from("history")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("ai_usage")
          .select("id")
          .eq("user_id", authUser.id)
          .eq("date", today),
      ]);

      if (historyResult.data) {
        setHistoryItems(
          historyResult.data.map((item) => ({
            id: item.id,
            type: item.type,
            date: new Date(item.created_at).toISOString().split("T")[0],
            output:
              typeof item.output === "string"
                ? item.output
                : JSON.stringify(item.output),
            metadata: item.metadata || {},
          })),
        );
      }

      if (usageResult.data) {
        const usedToday = usageResult.data.length || 0;
        const currentIsPro = profile?.plan === "pro";
        setRemainingUses(
          currentIsPro ? "Unlimited" : Math.max(0, 5 - usedToday),
        );
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, [authUser?.id, profile?.plan]);

  const saveToHistory = useCallback(
    async (type, output, metadata = {}) => {
      if (!authUser?.id) return;

      try {
        const supabase = await getSupabase();
        const { error } = await supabase.from("history").insert({
          user_id: authUser.id,
          type,
          output,
          metadata,
        });

        if (error) throw error;
        await refreshDashboard();
      } catch (err) {
        console.error("Failed to save to history:", err);
      }
    },
    [authUser?.id, refreshDashboard],
  );

  const handleUseFeature = useCallback(async () => {
    setApiError(null);
    const allowed = await trackUsage("test");
    if (!allowed) {
      setShowUpgradeModal(true);
      return;
    }
    toast.success("Feature used successfully!");
  }, [trackUsage]);

  const handleDelete = useCallback(async (id) => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("history").delete().eq("id", id);
      if (error) throw error;
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("History item deleted!");
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Couldn't delete item");
    }
  }, []);

  const handleCopy = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Output copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
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

  // ============================================================
  // ✅ FIXED: CANCEL SUBSCRIPTION HANDLER
  // ============================================================
  const handleCancelSubscription = useCallback(async () => {
    const confirmed = window.confirm(
      "Cancel your Pro subscription? You'll keep Pro access until the end of the current billing period.",
    );
    if (!confirmed || !authUser?.id) {
      if (!authUser?.id)
        toast.error("You need to be logged in to manage your subscription.");
      return;
    }

    setCancelling(true);
    try {
      const url = getApiUrl("api/billing/cancel-subscription");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser.id }),
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
  }, [authUser?.id]);

  // ============================================================
  // ✅ FIXED: UPGRADE CLICK HANDLER - Proper URL and syntax
  // ============================================================
  const handleUpgradeClick = useCallback(async () => {
    if (!authUser?.id) {
      toast.error("You need to be logged in to upgrade.");
      return;
    }

    setCheckoutLoading(true);
    try {
      // Use the helper function for clean URL
      const url = getApiUrl("api/checkout/create-session");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: authUser.id,
          email: authUser.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail || "Failed to create checkout session",
        );
      }

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Couldn't start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  }, [authUser?.id, authUser?.email]);

  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const MAX_SIZE_MB = 5;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(localPreviewUrl);
    setAvatarUploading(true);

    try {
      const optimizedBlob = await compressImageToWebP(file);
      const supabase = await getSupabase();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not signed in");

      const extension =
        optimizedBlob.type === "image/webp"
          ? "webp"
          : file.name.split(".").pop();
      const filePath = `${currentUser.id}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, optimizedBlob, {
          upsert: true,
          contentType: optimizedBlob.type || file.type,
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", currentUser.id);
      if (updateError) throw updateError;

      toast.success("Profile photo updated!");
      URL.revokeObjectURL(localPreviewUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("Couldn't upload your photo. Please try again.");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  }, []);

  // ============================================================
  // MEMOIZED COMPUTED VALUES
  // ============================================================
  const stats = useMemo(
    () => ({
      totalProposals: historyItems.filter((i) => i.type === "Proposal").length,
      totalSEO: historyItems.filter((i) => i.type === "SEO").length,
      latestProfileScore: (() => {
        const profileItem = historyItems.find((i) => i.type === "Profile");
        return profileItem?.metadata?.score || 0;
      })(),
    }),
    [historyItems],
  );

  const sidebarComponent = useMemo(
    () => (
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        handleLogout={handleLogout}
        menuItems={MENU_ITEMS}
      />
    ),
    [activeTab, handleTabChange, handleLogout],
  );

  // ============================================================
  // ROUTING HANDLERS
  // ============================================================
  if (location.pathname === "/payment/success") {
    return (
      <Suspense fallback={<LOADING_STATES.FULL_SCREEN />}>
        <PaymentSuccessView
          searchParams={new URLSearchParams(location.search)}
          onContinue={() => navigate("/dashboard")}
        />
      </Suspense>
    );
  }

  if (location.pathname === "/payment/cancel") {
    return (
      <Suspense fallback={<LOADING_STATES.FULL_SCREEN />}>
        <PaymentCancelView
          onBack={() =>
            navigate("/dashboard", { state: { activeTab: "Pricing" } })
          }
          onDashboard={() => navigate("/dashboard")}
        />
      </Suspense>
    );
  }

  if (!authLoading && !authUser) {
    return (
      <Suspense fallback={<LOADING_STATES.FULL_SCREEN />}>
        <PublicPricingView />
      </Suspense>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div
      className="min-h-screen bg-[#EFF6FF] flex relative"
      role="main"
      aria-label="Dashboard"
    >
      <Suspense fallback={null}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </Suspense>

      {/* Desktop Sidebar */}
      <nav className="hidden md:block" aria-label="Main navigation">
        {sidebarComponent}
      </nav>

      {/* Mobile Menu Button */}
      {!mobileSidebarOpen && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileSidebarOpen}
          aria-controls="mobile-sidebar"
          className="md:hidden fixed top-4 left-4 z-[180] min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center shadow-lg active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <Icon name="MENU" className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-[190]"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`md:hidden fixed inset-y-0 left-0 z-[200] w-72 max-w-[80%] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        role="navigation"
      >
        <div className="relative h-full">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-4 right-[-48px] min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-[#1E3A5F] text-white flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <Icon name="CLOSE" className="w-5 h-5" />
          </button>
          {sidebarComponent}
        </div>
      </div>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto relative"
        role="region"
        aria-label="Dashboard content"
      >
        {/* Usage Banner */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#EFF6FF] border-b border-gray-200 shadow-sm">
          <div
            className={`p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm border min-h-[56px] sm:min-h-[64px] ml-12 md:ml-0 ${
              remainingUses === 0 || remainingUses === "0"
                ? "bg-red-50 border-red-200"
                : "bg-white border-blue-100"
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Icon
                name="LIGHTNING"
                className={`w-5 h-5 flex-shrink-0 ${
                  remainingUses === 0 || remainingUses === "0"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              />
              <span
                className={`font-semibold text-sm sm:text-base ${
                  remainingUses === 0 || remainingUses === "0"
                    ? "text-red-700"
                    : "text-[#1E3A5F]"
                }`}
              >
                {isProUser
                  ? "Unlimited AI uses (Pro Plan)"
                  : `${remainingUses} of 5 free uses remaining today`}
              </span>
            </div>
            {!isProUser && (remainingUses === 0 || remainingUses === "0") && (
              <button
                onClick={() => handleTabChange("Pricing")}
                className="text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-bold hover:shadow-md transition min-h-[44px] sm:min-h-[36px] w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div
            className="mb-4 sm:mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start justify-between gap-3 shadow-sm"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <Icon
                name="ERROR"
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-red-700">Request failed</p>
                <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
              </div>
            </div>
            <button
              onClick={() => setApiError(null)}
              aria-label="Dismiss error message"
              className="text-red-400 hover:text-red-600 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            >
              <Icon name="CLOSE" className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        {activeTab === "Home" && (
          <div className="sticky top-[60px] sm:top-[72px] z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-[#EFF6FF] border-b border-gray-100">
            <div className="relative min-h-[80px] sm:min-h-[90px] rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] rounded-2xl p-4 sm:p-6 text-white shadow-lg flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-black flex items-center gap-3 flex-wrap">
                      Welcome back, {user.name}!
                      {isProUser && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-wide bg-white/20 text-white border border-white/40">
                          PRO
                        </span>
                      )}
                    </h1>
                    <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                      {user.role} Workspace Sub-Systems are compiled and active.
                    </p>
                  </div>
                  <button
                    onClick={handleUseFeature}
                    className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-500 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition min-h-[44px] sm:min-h-[38px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                  >
                    Test: Simulate Tool Usage (-1)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 pt-4 sm:pt-6">
          {/* Home Tab */}
          {activeTab === "Home" && (
            <div className="space-y-6 sm:space-y-8">
              {isLoading ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-xl animate-pulse min-h-[104px]"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded-xl animate-pulse h-[92px]"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                      {[1, 2, 3].map((idx) => (
                        <LOADING_STATES.SKELETON key={idx} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                      label="Total Proposals"
                      value={stats.totalProposals}
                    />
                    <StatCard
                      label="Total Gig SEOs"
                      value={stats.totalSEO}
                      color="text-[#1A56DB]"
                    />
                    <StatCard
                      label="Profile Score"
                      value={`${stats.latestProfileScore}%`}
                      color="text-green-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#1E3A5F] mb-4">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <QuickAction
                        icon="ANALYZER"
                        label="Analyze Profile"
                        description="Get an AI audit of your freelancer profile."
                        onClick={() => handleTabChange("Profile Analyzer")}
                        bgColor="bg-purple-100 text-purple-600"
                      />
                      <QuickAction
                        icon="SEARCH"
                        label="Optimize Gig"
                        description="Find the best keywords for ranking."
                        onClick={() => handleTabChange("Gig SEO")}
                        bgColor="bg-green-100 text-green-600"
                      />
                      <QuickAction
                        icon="PROPOSAL"
                        label="Write Proposal"
                        description="Generate a winning cover letter instantly."
                        onClick={() => handleTabChange("Proposal Generator")}
                        bgColor="bg-blue-100 text-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A5F]">
                        Recent History
                      </h2>
                      <button
                        onClick={() => handleTabChange("History")}
                        className="text-sm font-bold text-[#1A56DB] hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2"
                      >
                        View All
                      </button>
                    </div>
                    {historyItems.length === 0 ? (
                      <EmptyHistoryState
                        onStartGenerating={() =>
                          handleTabChange("Proposal Generator")
                        }
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                        {historyItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[72px] hover:bg-gray-50 transition"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  item.type === "Proposal"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.type === "SEO"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {item.type}
                              </span>
                              <span className="text-sm text-gray-800 font-medium truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                                {item.output.length > 50
                                  ? `${item.output.substring(0, 50)}...`
                                  : item.output}
                              </span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                              <time
                                className="text-xs text-gray-600 hidden sm:block"
                                dateTime={item.date}
                              >
                                {item.date}
                              </time>
                              <button
                                onClick={() => setViewModalData(item)}
                                className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-1.5 bg-[#EFF6FF] text-[#1A56DB] font-semibold rounded-lg hover:bg-blue-100 transition min-h-[44px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label={`View ${item.type} details`}
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

          {/* My Profile Tab */}
          {activeTab === "My Profile" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-12 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-100 pb-8 mb-8">
                  <label
                    htmlFor="avatar-upload"
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0 cursor-pointer group"
                    aria-label="Change profile photo"
                  >
                    {avatarPreview || user.avatarUrl ? (
                      <img
                        src={avatarPreview || user.avatarUrl}
                        alt={`${user.name}'s profile`}
                        width="112"
                        height="112"
                        loading="lazy"
                        decoding="async"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg shadow-blue-200"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#1E3A5F] to-[#1A56DB] text-white rounded-full flex items-center justify-center text-3xl sm:text-4xl font-black shadow-lg shadow-blue-200">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    {!avatarUploading && (
                      <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Icon
                          name="CAMERA"
                          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                        />
                      </div>
                    )}
                    {avatarUploading && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading}
                      className="sr-only"
                    />
                  </label>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">
                      {user.name}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mt-1">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click your photo to change it (JPG, PNG, or WebP, max 5MB)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
                      Current Plan
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span
                        className={`inline-block px-4 py-1.5 font-bold rounded-full text-sm ${
                          isProUser
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.plan}
                      </span>
                      {user.plan === "Free Tier" && (
                        <button
                          onClick={() => handleTabChange("Pricing")}
                          className="text-xs font-bold text-[#1A56DB] hover:underline min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2"
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

          {/* Lazy Loaded Tabs */}
          {activeTab === "Profile Analyzer" && (
            <Suspense fallback={<LOADING_STATES.TAB />}>
              <ProfileAnalyzer
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                onTrackUsage={trackUsage}
                onSaveHistory={saveToHistory}
                onRefresh={refreshDashboard}
              />
            </Suspense>
          )}

          {activeTab === "Gig SEO" && (
            <Suspense fallback={<LOADING_STATES.TAB />}>
              <GigSEO
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                onTrackUsage={trackUsage}
                onSaveHistory={saveToHistory}
                onRefresh={refreshDashboard}
              />
            </Suspense>
          )}

          {activeTab === "Proposal Generator" && (
            <Suspense fallback={<LOADING_STATES.TAB />}>
              <ProposalGenerator
                user={user}
                isProUser={isProUser}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                onTrackUsage={trackUsage}
                onSaveHistory={saveToHistory}
                onRefresh={refreshDashboard}
              />
            </Suspense>
          )}

          {/* Model Compare Tab */}
          {activeTab === "Model Compare" &&
            (isProUser ? (
              <Suspense fallback={<LOADING_STATES.TAB />}>
                <ModelCompare />
              </Suspense>
            ) : (
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <Icon name="LOCK" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                  Model Compare is a Pro feature
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mb-6">
                  Upgrade to Pro to compare AI model outputs side by side.
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Upgrade to Pro
                </button>
              </div>
            ))}

          {/* History Tab */}
          {activeTab === "History" &&
            (historyItems.length === 0 ? (
              <EmptyHistoryState
                onStartGenerating={() => handleTabChange("Proposal Generator")}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                        <th className="p-3 sm:p-4 font-semibold">Type</th>
                        <th className="p-3 sm:p-4 font-semibold hidden sm:table-cell">
                          Date
                        </th>
                        <th className="p-3 sm:p-4 font-semibold">Output</th>
                        <th className="p-3 sm:p-4 font-semibold text-right">
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
                          <td className="p-3 sm:p-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
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
                          <td className="p-3 sm:p-4 text-sm text-gray-600 hidden sm:table-cell">
                            <time dateTime={item.date}>{item.date}</time>
                          </td>
                          <td className="p-3 sm:p-4 text-sm text-gray-700 max-w-[100px] sm:max-w-[200px] md:max-w-xs truncate">
                            {item.output.length > 50
                              ? `${item.output.substring(0, 50)}...`
                              : item.output}
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                              <button
                                onClick={() => setViewModalData(item)}
                                className="text-[10px] sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-[#EFF6FF] text-[#1A56DB] font-semibold rounded hover:bg-blue-100 transition min-h-[44px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label={`View ${item.type} details`}
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-[10px] sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-600 font-semibold rounded hover:bg-red-100 transition min-h-[44px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-red-400"
                                aria-label={`Delete ${item.type}`}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

          {/* Billing Tab */}
          {activeTab === "Billing" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-10">
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
                      onClick={() => handleTabChange("Pricing")}
                      className="text-sm font-bold text-[#1A56DB] hover:underline min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2"
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
                      className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition min-h-[48px] border border-red-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
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

          {/* Pricing Tab */}
          {activeTab === "Pricing" && (
            <div className="max-w-5xl mx-auto py-4 sm:py-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#1E3A5F]">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg">
                  Choose the perfect plan to accelerate your freelance business.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                {/* Free Tier */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Free Tier
                  </h3>
                  <div className="mt-4 flex items-baseline text-4xl sm:text-5xl font-extrabold text-[#1E3A5F]">
                    $0{" "}
                    <span className="ml-1 text-lg sm:text-xl font-medium text-gray-500">
                      /mo
                    </span>
                  </div>
                  <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
                    Perfect for getting started and testing the tools.
                  </p>
                  <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                    {[
                      "5 AI Uses per day",
                      "Standard Proposal Generation",
                      "Basic Gig SEO",
                      "Standard Profile Analysis",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-gray-700 text-sm sm:text-base"
                      >
                        <Icon
                          name="CHECK"
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isProUser ? (
                    <div className="mt-6 sm:mt-8 w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold text-center min-h-[48px] flex items-center justify-center text-sm sm:text-base">
                      Downgrade to Free
                    </div>
                  ) : (
                    <button
                      disabled
                      className="mt-6 sm:mt-8 w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed min-h-[48px] text-sm sm:text-base"
                    >
                      Current Plan
                    </button>
                  )}
                </div>

                {/* Pro Tier */}
                <div className="bg-gradient-to-b from-[#1E3A5F] to-[#1A56DB] rounded-3xl shadow-2xl border border-blue-800 p-6 sm:p-8 md:p-10 text-white relative transform md:-translate-y-4">
                  <div className="absolute top-0 right-4 sm:right-6 transform -translate-y-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-[10px] sm:text-xs font-black uppercase tracking-wider py-1 px-2 sm:px-3 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-100">
                    Pro Plan
                  </h3>
                  <div className="mt-4 flex items-baseline text-4xl sm:text-5xl font-extrabold text-white">
                    $15{" "}
                    <span className="ml-1 text-lg sm:text-xl font-medium text-blue-200">
                      /mo
                    </span>
                  </div>
                  <p className="mt-3 sm:mt-4 text-blue-200 text-sm sm:text-base">
                    Unlimited power to dominate your freelance niche.
                  </p>
                  <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                    {[
                      "Unlimited AI Uses",
                      "Advanced Custom Proposals",
                      "Competitor Gig SEO Insights",
                      "Priority Email Support",
                      "Save Unlimited History",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-blue-50 text-sm sm:text-base"
                      >
                        <Icon
                          name="CHECK"
                          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isProUser ? (
                    <button
                      disabled
                      className="mt-6 sm:mt-8 w-full py-4 rounded-xl bg-yellow-400/50 text-yellow-900/50 font-black cursor-not-allowed min-h-[48px] text-sm sm:text-base"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleUpgradeClick}
                      disabled={checkoutLoading}
                      className="mt-6 sm:mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-blue-800"
                    >
                      {checkoutLoading
                        ? "Redirecting to checkout..."
                        : "Upgrade to Pro"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 bg-[#1E3A5F]/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          onKeyDown={(e) => e.key === "Escape" && setShowUpgradeModal(false)}
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-500" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
              <Icon name="STAR" className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3
              id="upgrade-modal-title"
              className="text-xl sm:text-2xl font-black text-[#1E3A5F] mb-2 sm:mb-3"
            >
              Limit Reached!
            </h3>
            <p className="text-gray-600 mb-2 leading-relaxed text-sm sm:text-base">
              You've used all 5 free generations for today. Upgrade to{" "}
              <strong className="text-[#1A56DB]">Pro</strong> for unlimited
              access.
            </p>
            <p className="text-sm font-bold text-red-500 mb-4 sm:mb-6">
              {remainingUses} of 5 free uses remaining today
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 sm:px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition w-full sm:w-auto border border-gray-200 min-h-[48px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  handleTabChange("Pricing");
                }}
                className="px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition w-full sm:w-auto min-h-[48px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                View Pro Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {viewModalData && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-modal-title"
          onKeyDown={(e) => e.key === "Escape" && setViewModalData(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3
                  id="view-modal-title"
                  className="text-lg sm:text-xl font-bold text-[#1E3A5F]"
                >
                  {viewModalData.type} Result
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  <time dateTime={viewModalData.date}>
                    {viewModalData.date}
                  </time>
                </p>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                aria-label="Close result details"
                className="text-gray-400 hover:text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              >
                <Icon name="CLOSE" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
              {viewModalData.output}
              <div className="mt-4 sm:mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Metadata Details
                </h4>
                <pre className="text-xs sm:text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(viewModalData.metadata, null, 2)}
                </pre>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-t border-gray-200 flex justify-end gap-2 sm:gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setViewModalData(null)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 min-h-[44px] sm:min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleCopy(viewModalData.output)}
                className="px-3 sm:px-4 py-2 bg-[#1E3A5F] text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-[#1A56DB] transition min-h-[44px] sm:min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Copy Output
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default Dashboard;
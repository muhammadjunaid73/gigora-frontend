import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Suspense,
  lazy,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#EFF6FF]">
    <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
  </div>
);

// supabaseUrl" errors on every login/signup attempt. Reading from env
// vars means this can't get silently wiped out again when this file is
// edited/replaced — the real values live in .env, not in code.

const supabaseUrl = "https://vqidkpdcykelymydlckc.supabase.co";
const supabaseKey = "sb_publishable_97Lshs7f3X2elVeXmv22tw_y72E9emP";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase config — set REACT_APP_SUPABASE_URL and " +
      "REACT_APP_SUPABASE_ANON_KEY in your frontend .env file, then restart npm start.",
  );
}

let supabasePromise = null;
export const getSupabase = () => {
  if (!supabasePromise) {
    supabasePromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(supabaseUrl, supabaseKey),
    );
  }
  return supabasePromise;
};

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabase, userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.warn(
        "Profile fetch failed or table not created yet:",
        err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let subscription;
    let cancelled = false;

    const initAuth = async () => {
      const supabase = await getSupabase();
      if (cancelled) return;

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(supabase, currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }

      // Listen for auth changes
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchProfile(supabase, currentUser.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      });

      subscription = data.subscription;
    };

    initAuth();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Feedback Widget — floating button, visible on EVERY page (rendered once
// in AppLayout below, outside <Routes>, so it isn't tied to any single
// page file). Opens a small popup asking for a 1-5 star rating and tags
// the submission with the current route via useLocation().
function FeedbackWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
     await fetch(`${API_URL}/api/feedback`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         rating,
         page: location.pathname,
         submittedAt: new Date().toISOString(),
       }),
     });
    } catch (err) {
      console.error("Feedback submit failed:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setRating(0);
        setHoverRating(0);
      }, 1200);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[300] flex items-center gap-2 bg-[#1A56DB] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#1E3A5F] transition text-sm font-semibold"
        aria-label="Give feedback"
      >
        💬 Feedback
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-[310] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close feedback"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🙏</div>
                <p className="font-bold text-[#1E3A5F]">
                  Thanks for the feedback!
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">
                  Rate this feature
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  How was your experience on this page?
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className="text-3xl leading-none transition-transform hover:scale-110"
                    >
                      {(hoverRating || rating) >= star ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!rating || submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// FIX: a logged-in user landing on "/" (e.g. bookmarked the site, or just
// opened a new tab and typed the domain) previously saw the marketing
// Landing page again — hero text, "Get Started Free" button, etc. — even
// though the Navbar already showed their name + Logout, proving they were
// authenticated. This wrapper redirects straight to /dashboard instead
// when there's a real session. Logged-out visitors still see Landing
// normally. `loading` guards against a flash of Landing before the
// initial session check finishes.
function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) return <RouteFallback />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}
// FIX: React Router's navigate() does NOT reset scroll position like a
// full page load does — so switching from a scrolled-down tab (e.g.
// Home) to another tab (e.g. Pricing) via handleTabChange kept the old
// scroll offset, making the new page appear to start mid-way down (logo
// cut off at top). This resets scroll to top on every route change.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


// FIX: Dashboard already renders its own complete navigation (logo,
// menu, mobile hamburger + close button, Logout) inside the sidebar.
// Previously the global <Navbar /> was rendered on EVERY route,
// including /dashboard — so on the Dashboard page you'd see TWO
// overlapping nav systems (Navbar's hamburger/logo/logout stacked on
// top of Dashboard's own hamburger/logo/logout), which is exactly the
// confusing double-header look in the screenshots. This wrapper hides
// the global Navbar on routes that already have their own header.
function AppLayout() {
  const location = useLocation();
 const hideGlobalNavbar =
  location.pathname.startsWith("/dashboard") ||
  location.pathname === "/payment/success" ||
  location.pathname === "/payment/cancel";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideGlobalNavbar && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Dashboard />} />
            <Route path="/dashboard/profile-analyzer" element={<Dashboard />} />
            <Route path="/dashboard/gig-seo" element={<Dashboard />} />
            <Route path="/dashboard/proposal-generator" element={<Dashboard />}/>
            <Route path="/dashboard/model-compare" element={<Dashboard />} />
            <Route path="/dashboard/history" element={<Dashboard />} />
            <Route path="/dashboard/billing" element={<Dashboard />} />
            <Route path="/dashboard/pricing" element={<Dashboard />} />
            <Route path="/payment/success" element={<Dashboard />} />
            <Route path="/payment/cancel" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <FeedbackWidget />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;

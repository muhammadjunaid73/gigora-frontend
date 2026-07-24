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
  useNavigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";

// FIX: Route-level code splitting.
// Previously Landing, Login, Signup, and Dashboard were all imported
// eagerly at the top of the file — meaning ANY page load (even just the
// marketing Landing page) pulled in the full Dashboard bundle (React
// Query logic, StatCards, history tables, etc.) inside main.js.
// Splitting them into lazy chunks means each route only downloads its
// own code, cutting "unused JavaScript" and main-thread work on first load.
const Landing = lazy(
  () => import(/* webpackChunkName: "landing" */ "./pages/Landing"),
);
const Login = lazy(
  () => import(/* webpackChunkName: "login" */ "./pages/Login"),
);
const Signup = lazy(
  () => import(/* webpackChunkName: "signup" */ "./pages/Signup"),
);
const Dashboard = lazy(
  () => import(/* webpackChunkName: "dashboard" */ "./pages/Dashboard"),
);
const NotFound = lazy(
  () => import(/* webpackChunkName: "not-found" */ "./pages/NotFound"),
);

// FIX: OnboardingFlow is a NAMED export living inside Landing.jsx (not its
// own file — see Landing.jsx). Previously it was pulled in via a static
// `import { OnboardingFlow } from "./pages/Landing"` at the top of this
// file, which forces Webpack to bundle the ENTIRE Landing.jsx module
// (component, JSX, styles) into the main/eager bundle for every route —
// undoing the code-splitting above, since a static import always resolves
// before render regardless of the `lazy()` calls elsewhere.
// This lazy-wraps the same dynamic import() used for `Landing` above and
// re-exports the named member as the default, so it shares the same
// "landing" chunk and only downloads on demand (either when the user
// visits "/" or "/onboarding" — whichever comes first).
const OnboardingFlow = lazy(() =>
  import(/* webpackChunkName: "landing" */ "./pages/Landing").then(
    (module) => ({ default: module.OnboardingFlow }),
  ),
);

// Simple full-page fallback shown while a route chunk downloads.
// Kept intentionally minimal (no layout-shifting content) since it's
// only visible for a brief moment on slow connections / first visits.
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#EFF6FF]">
    <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
  </div>
);

const supabaseUrl = "https://vqidkpdcykelymydlckc.supabase.co";
const supabaseKey = "sb_publishable_97Lshs7f3X2elVeXmv22tw_y72E9emP";

let supabasePromise = null;
export const getSupabase = () => {
  if (!supabasePromise) {
    supabasePromise = import(
      /* webpackChunkName: "supabase-sdk" */ "@supabase/supabase-js"
    ).then(({ createClient }) => createClient(supabaseUrl, supabaseKey));
  }
  return supabasePromise;
};

// React Context API to share user state globally across components

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabase, userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
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

    // FIX: defer the Supabase SDK download/init until the browser is idle
    // instead of firing it immediately on mount. This gets the ~55KB
    // supabase-sdk chunk off the critical rendering path so it no longer
    // competes with First Contentful Paint / LCP on every route (even the
    // public Landing page, which doesn't need auth right away).
    // Falls back to a short setTimeout for browsers without
    // requestIdleCallback (e.g. Safari).
    const idleHandle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(initAuth, { timeout: 2000 })
        : setTimeout(initAuth, 200);

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
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

// App component ke bahar — Routes ke andar render hoga isliye useNavigate yahan kaam karega
function OnboardingPage() {
  const navigate = useNavigate();
  return <OnboardingFlow onComplete={() => navigate("/dashboard")} />;
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
      await fetch("/api/feedback", {
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
  const hideGlobalNavbar = [
    "/dashboard",
    "/payment/success",
    "/payment/cancel",
  ].includes(location.pathname);

  return (
    <>
      {!hideGlobalNavbar && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment/success" element={<Dashboard />} />
          <Route path="/payment/cancel" element={<Dashboard />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          {/* Catch-all — must stay LAST so it only matches unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Rendered once here (outside <Routes>) so it shows on every page
          without touching Landing.jsx, Dashboard.jsx, Login.jsx, etc. */}
      <FeedbackWidget />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;

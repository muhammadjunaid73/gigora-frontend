import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Suspense,
  lazy,
} from "react";
import {BrowserRouter as Router, Routes, Route, useNavigate,} 
from "react-router-dom";
import Navbar from "./components/Navbar";
import { OnboardingFlow } from "./pages/Landing";

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
        .select("full_name")
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

// App component ke bahar — Routes ke andar render hoga isliye useNavigate kaam karega
function OnboardingPage() {
  const navigate = useNavigate();
  return <OnboardingFlow onComplete={() => navigate("/dashboard")} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment/success" element={<Dashboard />} />
            <Route path="/payment/cancel" element={<Dashboard />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;

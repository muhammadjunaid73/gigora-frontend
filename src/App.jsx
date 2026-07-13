// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import { createClient } from "@supabase/supabase-js";

// // ✅ Directly Hardcoded for local testing to fix the "supabaseUrl is required" crash
// const supabaseUrl =
//   process.env.REACT_APP_SUPABASE_URL ||
//   "https://vqidkpdcykelymydlckc.supabase.co";
// const supabaseKey =
//   process.env.REACT_APP_SUPABASE_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaWRrcGRjeWtlbHlteWRsY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzY4NjMsImV4cCI6MjA5OTMxMjg2M30.M5la69nTjKsZNLCrRjA6gEPhXwYt8vg3-_DHohqObhk";

// // Safe instance creation with logical fallback
// export const supabase =
//   supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// if (!supabase) {
//   console.warn("Supabase client failed to initialize. Check your credentials.");
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Home / Landing Page Route */}
//         <Route path="/" element={<Landing />} />

//         {/* Auth & Internal App Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { createClient } from "@supabase/supabase-js";





// Supabase credentials setup - connects your app to the database
const supabaseUrl = "https://vqidkpdcykelymydlckc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaWRrcGRjeUklbHlteWRsY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzY4NjMsImV4cCI6MjA5OTMxMjg2M30.M5la69nTjKsZNLCrRjA6gEPhXwYt8vg3-_DHohqObhk";

export const supabase = createClient(supabaseUrl, supabaseKey);

// React Context API to share user state globally across components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch the user's real full name from 'profiles' table in database
  const fetchProfile = async (userId) => {
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

  // Listen to login/logout events in real-time
  useEffect(() => {
    // Check initial active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    });

    // Real-time auth state updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Standard Logout function accessible globally
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Simple custom hook to import auth state into any page/component easily
export function useAuth() {
  return useContext(AuthContext);
}


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar will render on every page and read user state from AuthProvider */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;

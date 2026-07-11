import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { createClient } from "@supabase/supabase-js";

// ✅ Directly Hardcoded for local testing to fix the "supabaseUrl is required" crash
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://vqidkpdcykelymydlckc.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaWRrcGRjeWtlbHlteWRsY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzY4NjMsImV4cCI6MjA5OTMxMjg2M30.M5la69nTjKsZNLCrRjA6gEPhXwYt8vg3-_DHohqObhk";

// Safe instance creation with logical fallback
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
  console.warn("Supabase client failed to initialize. Check your credentials.");
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Landing Page Route */}
        <Route path="/" element={<Landing />} />

        {/* Auth & Internal App Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

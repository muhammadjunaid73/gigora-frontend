import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../App";

// Reached via the link in Supabase's password-reset email
// (Login.jsx's handleForgotPassword sets redirectTo to this page).
// Supabase's client automatically detects the recovery token in the
// URL and establishes a temporary "recovery" session — no extra parsing
// needed here, we just need to call updateUser() with the new password.
const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        alert(error.message);
      } else {
        setDone(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      alert(
        "Something went wrong. The reset link may have expired — try requesting a new one.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#1E3A5F] tracking-wider">
            GIGORA
          </h1>
          <p className="mt-3 text-gray-600">
            Set a new password for your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-bold text-[#1E3A5F] mb-1">Password updated!</p>
              <p className="text-sm text-gray-600">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

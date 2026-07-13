import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../App";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        console.log("Logged in:", data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#1E3A5F] tracking-wider">
            GIGORA
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome back! Login to continue your freelance journey.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {/* Remember */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>{" "}
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
                  1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92
                  3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />

                <path
                  d="M12 23c2.97 0 5.46-.98
                  7.28-2.66l-3.57-2.77c-.98.66-2.23
                  1.06-3.71 1.06-2.86
                  0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
                  20.53 7.7 23 12 23z"
                  fill="#34A853"
                />

                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09
                  s.13-1.43.35-2.09V7.06H2.18C1.43
                  8.55 1 10.22 1 12s.43
                  3.45 1.18 4.94l3.66-2.85z"
                  fill="#FBBC05"
                />

                <path
                  d="M12 5.38c1.62
                  0 3.06.56 4.21
                  1.64l3.15-3.15C17.45
                  2.09 14.97 1 12
                  1 7.7 1 3.99
                  3.47 2.18
                  7.06l3.66
                  2.84c.87-2.6
                  3.3-4.52
                  6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#1A56DB] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

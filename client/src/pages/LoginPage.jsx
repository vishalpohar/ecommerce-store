import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const inputBase =
    "block w-full pl-10 pr-4 py-2.5 text-sm sm:text-base text-gray-800 bg-gray-50/70 border border-gray-200 rounded-xl placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200";

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <header className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            EasyBuy Account
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Sign in to your account to continue shopping.
          </p>
        </header>

        {/* Google Sign-In Mount Point */}
        <div id="googleSignInDiv" className="flex justify-center" />

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/login"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold py-3 px-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider & Sign Up Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">
                  New to EasyBuy?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/signup"
                className="block w-full text-center text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl py-2.5 px-4 transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Note */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck
            className="w-4 h-4 text-emerald-600 shrink-0"
            aria-hidden="true"
          />
          <span>Your data is securely encrypted and never shared.</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

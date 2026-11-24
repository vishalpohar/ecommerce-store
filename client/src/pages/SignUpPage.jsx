import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../utils/validation";

const ROLES = [
  { id: "customer", label: "Customer", icon: ShoppingBag },
  { id: "seller", label: "Seller", icon: Store },
];

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: {},
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, loading } = useUserStore();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (id === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: formData.confirmPassword
          ? validateConfirmPassword(value, formData.confirmPassword)
          : prev.confirmPassword,
      }));
    } else if (id === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (
      emailError ||
      Object.keys(passwordError).length > 0 ||
      confirmPasswordError?.status === "error"
    ) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    const response = await signup(formData);
    if (response?.status) navigate("/login");
  };

  const getInputClass = (hasError) =>
    `block w-full pl-10 pr-4 py-2.5 text-sm sm:text-base text-gray-800 border rounded-xl placeholder-gray-400 outline-none focus:ring-4 transition-all duration-200 ${
      hasError
        ? "border-red-400 bg-red-50/50 focus:bg-white focus:border-red-500 focus:ring-red-500/10"
        : "border-gray-200 bg-gray-50/70 focus:bg-white focus:border-blue-500 focus:ring-blue-500/10"
    }`;

  const hasPasswordError = Object.keys(errors.password || {}).length > 0;
  const hasConfirmError = errors.confirmPassword?.status === "error";

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <header className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Join EasyBuy
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Join thousands of shoppers and sellers on EasyBuy.
          </p>
        </header>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                I want to join as
              </span>
              <div
                role="radiogroup"
                aria-label="Account role"
                className="grid grid-cols-2 gap-2.5">
                {ROLES.map(({ id, label, icon: Icon }) => {
                  const isSelected = formData.role === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: id }))
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-500 text-blue-700 ring-2 ring-blue-500/15"
                          : "bg-gray-50/70 border-gray-200 text-gray-600 hover:bg-gray-100/80"
                      }`}>
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  placeholder="John Doe"
                  onChange={handleChange}
                  className={getInputClass(false)}
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="you@example.com"
                  className={getInputClass(Boolean(errors.email))}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Create a strong password"
                  className={`${getInputClass(hasPasswordError)} pr-10`}
                  required
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

              {hasPasswordError && (
                <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <ul className="text-xs text-amber-800 space-y-0.5">
                      {Object.values(errors.password).map(
                        (msg) => msg && <li key={msg}>• {msg}</li>,
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Confirm your password"
                  className={`${getInputClass(hasConfirmError)} pr-10`}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {errors.confirmPassword?.message && (
                <p
                  className={`text-xs mt-1.5 flex items-center gap-1 ${
                    errors.confirmPassword.status === "success"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}>
                  {errors.confirmPassword.icon && (
                    <errors.confirmPassword.icon
                      className="w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                  Terms and Conditions
                </a>
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline underline-offset-2 transition-colors">
              Sign in
            </Link>
          </p>
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

export default SignUpPage;

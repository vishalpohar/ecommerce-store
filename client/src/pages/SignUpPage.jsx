import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../utils/validation";

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

    let fieldError = "";
    if (id === "email") fieldError = validateEmail(value);
    if (id === "password") fieldError = validatePassword(value);
    if (id === "confirmPassword")
      fieldError = validateConfirmPassword(formData.password, value);

    setErrors((prev) => ({ ...prev, [id]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (emailError || Object.keys(passwordError).length > 0 || confirmPasswordError.status==="error") {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    const response = await signup(formData);
    if (response.status) navigate("/login");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
          <p className="text-gray-600">Join thousands of happy customers</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  placeholder="John Doe"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 text-gray-700 border border-gray-300 rounded-xl placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="you@example.com"
                  className={`block w-full pl-10 pr-3 py-3 text-gray-700 border rounded-xl placeholder-gray-400 outline-none focus:ring-1 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Create a password"
                  className={`block w-full pl-10 pr-10 py-3 text-gray-700 border rounded-xl placeholder-gray-400 outline-none focus:ring-1 transition-all duration-200 ${
                    Object.keys(errors.password).length > 0
                      ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Eye"
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {/* Password Requirements */}
              {Object.keys(errors.password).length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800 space-y-1">
                      {errors.password.length && (
                        <p>• {errors.password.length}</p>
                      )}
                      {errors.password.uppercase && (
                        <p>• {errors.password.uppercase}</p>
                      )}
                      {errors.password.lowercase && (
                        <p>• {errors.password.lowercase}</p>
                      )}
                      {errors.password.number && (
                        <p>• {errors.password.number}</p>
                      )}
                      {errors.password.special && (
                        <p>• {errors.password.special}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Confirm your password"
                  className={`block w-full pl-10 pr-10 py-3 text-gray-700 border rounded-xl placeholder-gray-400 outline-none focus:ring-1 transition-all duration-200 ${
                    errors.confirmPassword.status === "error"
                      ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Eye"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  className={`${errors.confirmPassword?.status === "success" ? "text-green-500" : "text-red-500"} text-xs mt-1 flex items-center gap-1`}>
                  {errors.confirmPassword.icon && (
                    <errors.confirmPassword.icon className="w-3 h-3" />
                  )}
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleChange}
              className="w-full text-sm text-gray-700 font-semibold tracking-wide border rounded-xl outline-none px-2 py-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-300">
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 font-medium">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="Sign Up"
              className="w-full border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing Up...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-700 text-[16px] font-medium hover:underline underline-offset-2 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your data is securely encrypted • We never share your information
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

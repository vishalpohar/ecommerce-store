import { useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import EmailStep from "./EmailStep";
import OtpInput from "./OtpInput";
import PasswordForm from "./PasswordForm";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const navigate = useNavigate();

  const startTimer = () => {
    setTimeLeft(300); // 5 minutes in seconds
    setCanResend(false);
  };

  const sendOtp = async () => {
    const emailResponse = validateEmail(email);
    if (emailResponse !== "") {
      toast.error(emailResponse || "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/send-otp", { email });
      setStep(2);
      startTimer();
      toast.success(response.data.message || "OTP sent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await axios.post("/auth/send-otp", { email });
      startTimer();
      toast.success(response.data.message || "OTP resent successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const errors = validatePassword(newPassword);
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error("Please meet all password requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.message);
      // Reset form after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {step === 1
              ? "Enter your email to receive a verification code"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {step === 1 ? (
              // Step 1: Email Input
              <EmailStep
                email={email}
                setEmail={setEmail}
                sendOtp={sendOtp}
                loading={loading}
              />
            ) : (
              // Step 2: OTP and Password Reset
              <div className="space-y-6">
                {/* OTP Input */}
                <OtpInput
                  otp={otp}
                  setOtp={setOtp}
                  resendOtp={resendOtp}
                  canResend={canResend}
                  setCanResend={setCanResend}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                  step={step}
                  loading={loading}
                />

                <PasswordForm
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  resetPassword={resetPassword}
                  otp={otp}
                  passwordErrors={passwordErrors}
                  setPasswordErrors={setPasswordErrors}
                  loading={loading}
                />
              </div>
            )}
          </div>

          {/* Back to Login Link */}
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Having trouble? Contact our support team for assistance
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

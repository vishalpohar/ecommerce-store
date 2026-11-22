import { AlertCircle, CheckCircle } from "lucide-react";

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
  return "";
};

export const validatePassword = (password) => {
  const errors = {};
  if (password.length < 8) {
    errors.length = "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    errors.uppercase = "Must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    errors.lowercase = "Must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    errors.number = "Must contain at least one number";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.special = "Must contain at least one special character (!@#$%^&*)";
  }
  return errors;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword)
    return {
      status: "error",
      icon: AlertCircle,
      message: "Confirm Password is required.",
    };
  if (password !== confirmPassword)
    return {
      status: "error",
      icon: AlertCircle,
      message: "Passwords do not match. Please try again",
    };
  return {
    status: "success",
    icon: CheckCircle,
    message: "Passwords match.",
  };
};

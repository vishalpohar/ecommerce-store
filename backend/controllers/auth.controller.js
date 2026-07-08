import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail.js";
import {
  generateTokens,
  storeRefreshToken,
  setCookies,
} from "../utils/auth.utils.js";
import ApiError from "../utils/ApiError.js";

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) return next(new ApiError(400, "User already exists"));

    const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const STRONG_PASSWORD_PATTERN =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!EMAIL_PATTERN.test(email)) {
      return next(
        new ApiError(
          400,
          "Please enter a valid email address (e.g., user@example.com).",
        ),
      );
    }

    if (!STRONG_PASSWORD_PATTERN.test(password)) {
      return next(
        new ApiError(
          400,
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        ),
      );
    }

    const user = await User.create({ name, email, password, role });

    //authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "You have signed up successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return next(new ApiError(400, "Invalid email or password"));
    }
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError(400, "No refresh token provided"));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return next(new ApiError(400, "Invalid refresh token"));
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true, message: "Token refresh successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    let user = req.user;
    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json(user);
  } catch (error) {
    return next(error);
  }
};

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp && user.otpExpires > Date.now())
      return next(
        new ApiError(
          400,
          "Verification code already sent. Please wait before requesting again",
        ),
      );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      return next(
        new ApiError(400, "OTP generated but email failed. Try again later."),
      );
    }

    res.json({ message: "Verification code sent successfully" });
  } catch (err) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return next(new ApiError(400, "Invalid or expired OTP"));
    }

    user.password = newPassword;

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return next(error);
  }
};

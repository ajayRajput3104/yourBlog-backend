import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshTokenModel.js";
import {User} from "../models/userModel.js"
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import env from "../config/env.js";

const SALT_ROUNDS = env.saltRounds || 10;

// @desc    Signup new user
export const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const accessToken = generateAccessToken(user._id );
    const refreshToken = generateRefreshToken(user._id);

    //CREATING AND SAVING REFRESH TOKEN DOCUMENT
    await new RefreshToken({ token: refreshToken, user: user._id }).save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    //res.redirect('/');
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await new RefreshToken({ token: refreshToken, user: user._id }).save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    jwt.verify(token, env.refreshTokenSecret, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });
      const accessToken = generateAccessToken(user.userId);
      res.json({ success: true, accessToken });
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// @desc    Logout user (delete refresh token)
export const logout = async (req, res) => {
  try {
    const { token } = req.body;
    await RefreshToken.deleteOne({ token });
    res.sendStatus(204);
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
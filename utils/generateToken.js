import jwt from "jsonwebtoken";
import env from "../config/env.js";

if (!env.accessTokenSecret) {
  throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
}
if (!env.refreshTokenSecret) {
  throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables");
}

export const generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, env.accessTokenSecret, {
    expiresIn: env.jwtExpiration,
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ userId: id }, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiration,
  });
};
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";

export const generateAuthToken = (userId, email) => {
  if (!appConfig.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = {
    email,
    userId,
  };

  return jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRES_IN || "1d",
  });
};

export const verifyToken = (token) => {
  if (!appConfig.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, appConfig.JWT_SECRET);
};

export function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Authorization header is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token is missing",
      });
    }

    const decodedToken = jwt.verify(token, appConfig.JWT_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, msg: "Auth failed: " + e.message });
  }
}

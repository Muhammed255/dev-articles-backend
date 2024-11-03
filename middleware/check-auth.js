import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";

export function checkAuth(req, res, next) {
  try {
		const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Authorization header is missing"
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token is missing"
      });
    }

    const decodedToken = jwt.verify(token, appConfig.JWT_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: "Auth failed: " + e.message });
  }
}

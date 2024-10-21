import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";

export function checkAuth(req, res, next) {
  try {
		if(req.headers && !req.headers.authorization) {
			return res.status(401).json({msg: "Token is missed"})
		}
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, appConfig.JWT_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (e) {
    res.status(401).json({ msg: "Auth failed" + e.message });
  }
}

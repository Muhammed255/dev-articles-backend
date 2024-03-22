import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config";

export function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, appConfig.JWT_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (e) {
		console.log(e)
    res.status(401).json({ msg: "Auth failed" });
  }
}

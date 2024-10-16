import express from "express";
import authController from "../controllers/auth.controller.js";
import { checkAuth } from "./../middleware/check-auth.js";
import multer from "multer";
import { fileFilter } from "./article-post.routes.js";

export const authRouter = express.Router();

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

authRouter.post("/admin-signup", authController.admin_signup);

authRouter.get("/:userId", checkAuth, authController.findUserById);

authRouter.get("/user/:username", checkAuth, authController.findUserByUsername);

authRouter.get("/users", checkAuth, authController.getUsers);

authRouter.get("/profile", checkAuth, authController.getAuthProfle);

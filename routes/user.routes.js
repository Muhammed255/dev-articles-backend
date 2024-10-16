import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import {
	followUser,
	isFollow,
	unfollowUser,
	updateImage,
	updatePassword,
	updateProfile,
} from "../controllers/user.controller.js";
import multer from "multer";
import { fileFilter } from "./article-post.routes.js";

export const userRoutes = express.Router();

userRoutes.put("/update-profile", checkAuth, updateProfile);

userRoutes.put("/update-password", checkAuth, updatePassword);

// Image update route using multer to handle file upload
userRoutes.put(
	"/update-image",
	checkAuth,
	multer({
		storage: multer.diskStorage({}),
		fileFilter: fileFilter,
		limits: { fileSize: 1000000 },
	}).single("imageUrl"),
	updateImage
);

userRoutes.put("/follow/:userId", checkAuth, followUser);
userRoutes.put("/unfollow/:userId", checkAuth, unfollowUser);
userRoutes.get("/is-follow/:userId", checkAuth, isFollow);

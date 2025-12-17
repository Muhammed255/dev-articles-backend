import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import {
	followUser,
	getDashboard,
	isFollow,
	unfollowUser,
	updateImage,
	updatePassword,
	updateProfile,
} from "../controllers/user.controller.js";
import multer from "multer";
import { fileFilter } from "./article-post.routes.js";
import { tokenUpdateMiddleware } from "../middleware/token-update.js";


/**
 * @swagger
 * /user/follow/{userId}:
 *   put:
 *     summary: Follow a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to follow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       400:
 *         description: You are already following this user or cannot follow yourself.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /user/unfollow/{userId}:
 *   put:
 *     summary: Unfollow a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to unfollow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       400:
 *         description: You are not following this user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */


/**
 * @swagger
 * /user/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               linkedInUrl:
 *                 type: string
 *               stackoverflowUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /user/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Incorrect old password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /user/update-image:
 *   put:
 *     summary: Update user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image updated successfully.
 *       400:
 *         description: No file uploaded.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /user/is-follow/{userId}:
 *   get:
 *     summary: Check if a user is followed
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to check follow status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the follow status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFollowing:
 *                   type: boolean
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /user/get-dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     categoriesCount:
 *                       type: integer
 *                     topicsCount:
 *                       type: integer
 *                     articlesCount:
 *                       type: integer
 *                     commentsCount:
 *                       type: integer
 *                     repliesCount:
 *                       type: integer
 *                     likesCount:
 *                       type: integer
 *                     dislikesCount:
 *                       type: integer
 *       404:
 *         description: No Admin found.
 *       500:
 *         description: Error occurred.
 */


export const userRoutes = express.Router();

userRoutes.get("/get-dashboard", checkAuth, tokenUpdateMiddleware, getDashboard);

userRoutes.put("/update-profile", checkAuth, tokenUpdateMiddleware, updateProfile);

userRoutes.put("/update-password", checkAuth, tokenUpdateMiddleware, updatePassword);

// Image update route using multer to handle file upload
userRoutes.put(
	"/update-image",
	checkAuth,
	tokenUpdateMiddleware,
	multer({
		storage: multer.diskStorage({}),
		fileFilter: fileFilter,
		limits: { fileSize: 1000000 },
	}).single("imageUrl"),
	updateImage
);

userRoutes.put("/follow/:userId", checkAuth, tokenUpdateMiddleware, followUser);
userRoutes.put("/unfollow/:userId", checkAuth, tokenUpdateMiddleware, unfollowUser);
userRoutes.get("/is-follow/:userId", checkAuth, tokenUpdateMiddleware, isFollow);

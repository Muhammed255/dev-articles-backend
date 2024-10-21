import express from "express";
import authController from "../controllers/auth.controller.js";
import { checkAuth } from "./../middleware/check-auth.js";



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         bio:
 *           type: string
 *         role:
 *           type: string
 *           example: user
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Account created successfully
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /auth/admin-signup:
 *   post:
 *     summary: Sign up a new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Admin account created successfully
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Auth failed
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: No user found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/user/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: No user found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: No user found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: No users found
 */









export const authRouter = express.Router();

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

authRouter.post("/admin-signup", authController.admin_signup);

authRouter.get("/:userId", checkAuth, authController.findUserById);

authRouter.get("/user/:username", checkAuth, authController.findUserByUsername);

authRouter.get("/users", checkAuth, authController.getUsers);

authRouter.get("/profile", checkAuth, authController.getAuthProfle);

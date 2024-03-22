import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkAuth } from "../middleware/check-auth";

export const authRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operations related to auth
 */



/**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               bio:
   *                 type: string
   *     responses:
   *       '200':
   *         description: User registered successfully
   *       '400':
   *         description: User already exists
   *       '500':
   *         description: Internal server error
   */


/**
 * @swagger
 * /api/auth/admin-signup:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Admin user registered successfully
 *       '400':
 *         description: User already exists
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
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
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Authentication failed
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Retrieved users successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Retrieved user successfully
 *       '401':
 *         description: No user found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/user/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Retrieved user successfully
 *       '401':
 *         description: No user found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Retrieved user profile successfully
 *       '401':
 *         description: No user found
 *       '500':
 *         description: Internal server error
 */


const auth = AuthController.getAuth;

authRouter.post("/login", auth.login);

authRouter.post("/signup", auth.signup);

authRouter.post("/admin-signup", auth.admin_signup);
authRouter.get("/users", auth.getUsers);
authRouter.get("/profile", checkAuth, auth.getAuthProfle);
authRouter.get("/get-dashboard", checkAuth, auth.getDashboard);
authRouter.get("/user/:username", checkAuth, auth.findUserByUsername);
authRouter.get("/:userId", checkAuth, auth.findUserById);

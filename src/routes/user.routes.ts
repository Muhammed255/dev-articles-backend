import { Router } from "express";
import multer from "multer";
import { v4 } from "uuid";
import { UserController } from "../controllers/user.controller";
import { checkAuth } from "../middleware/check-auth";

export const userRoutes = Router();

const MIME_TYPE_MAP = {
	"image/jpg": "jpg",
	"image/jpeg": "jpeg",
	"image/png": "png",
};

const fileFilter = (req, file, cb) => {
	const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
	let error = isValid ? null : new Error("Invalid mime type!");
	cb(error, isValid);
};



/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: User update profile
 *     tags: [User Actions]
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
 *                 enum: [male, female]
 *               birthdate:
 *                 type: date
 *                 example: 1997-05-25
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               linkedInUrl:
 *                 type: string
 *               stackoverflowUrl:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/update-password:
 *   put:
 *     summary: User update profile
 *     tags: [User Actions]
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
 *       '200':
 *         description: Profile updated successfully
 *       '401':
 *         description: Incorrect old password
 *       '500':
 *         description: Internal server error
 */


/**
 * @openapi
 * /api/user/update-image:
 *   put:
 *     summary: Update user image.
 *     description: Update user profile image.
 *     security:
 *       - bearerAuth: []
 *     tags: [User Actions]
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
 *       '200':
 *         description: Image updated successfully.
 *       '500':
 *         description: Internal server error.
 */




const userController = UserController.getUser;

userRoutes.put("/update-profile", checkAuth, userController.updateProfile);
userRoutes.put("/update-password", checkAuth, userController.updatePassword);
userRoutes.put(
	"/update-image",
	checkAuth,
	multer({
		storage: multer.diskStorage({
			filename: (req, file, cb) => {
				const ext = MIME_TYPE_MAP[file.mimetype];
				cb(null, v4() + "." + ext);
			},
		}),
		fileFilter: fileFilter,
		limits: { fileSize: 1000000 },
	}).single("imageUrl"),
	userController.updateImage
	);
	userRoutes.put("/follow/:userId", checkAuth, userController.followUser);
	userRoutes.put("/unfollow/:userId", checkAuth, userController.unfollowUser);
	userRoutes.get("/is-follow/:userId", checkAuth, userController.isFollow);
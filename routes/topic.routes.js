import express from "express";
import multer from "multer";
import topicController from "../controllers/topic.controller.js";
import { checkAuth } from "../middleware/check-auth.js";
import { tokenUpdateMiddleware } from "../middleware/token-update.js";



/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the topic
 *         description:
 *           type: string
 *           description: The description of the topic
 *         categoryId:
 *           type: string
 *           description: The ID of the topic's category
 *         userId:
 *           type: string
 *           description: The ID of the user who created the topic
 *         cloudinary_id:
 *           type: string
 *           description: Cloudinary public ID for the topic image
 *         image:
 *           type: string
 *           description: The URL of the topic image
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         role:
 *           type: string
 *           description: Role of the user (admin/user)
 */

/**
 * @swagger
 * tags:
 *   - name: Topics
 *     description: Topic management API
 */


/**
 * @swagger
 * /api/topics/create:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Topic created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/topics/get-all:
 *   get:
 *     summary: Get all topics for authenticated admin user
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/topics/all-topics:
 *   get:
 *     summary: Get all topics (for general users)
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: List of all topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/topics/{topicId}:
 *   get:
 *     summary: Get topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - name: topicId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the topic to retrieve
 *     responses:
 *       200:
 *         description: Topic found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: topicId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: topicId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/topics/get-other-topics/{topicId}:
 *   get:
 *     summary: Get all topics except the one specified by ID
 *     tags: [Topics]
 *     parameters:
 *       - name: topicId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       500:
 *         description: Server error
 */









export const topicRoutes = express.Router();

topicRoutes.post(
  "/create",
  checkAuth,
	tokenUpdateMiddleware,
  multer({ storage: multer.diskStorage({}) }).single("image"),
  topicController.create_topic
);

topicRoutes.get("/get-all", topicController.findAllTopics);
topicRoutes.get("/admin-topics", checkAuth, tokenUpdateMiddleware, topicController.findAllTopics);
topicRoutes.get("/all-topics", topicController.getAllTopics)
topicRoutes.get("/get-other-topics/:topicId", topicController.getOtherTopics);

topicRoutes
  .route("/:topicId")
  .get(topicController.findTopicById)
  .put(
    checkAuth,
		tokenUpdateMiddleware,
    multer({ storage: multer.diskStorage({}) }).single("image"),
    topicController.updateTopic
  )
  .delete(checkAuth, tokenUpdateMiddleware, topicController.removeTopic);

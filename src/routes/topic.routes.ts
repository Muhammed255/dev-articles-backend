import { Router } from "express";
import multer from "multer";
import { TopicController } from "../controllers/topic.controller";
import { checkAuth } from "../middleware/check-auth";

export const topicRoutes = Router();


/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: Operations related to topics
 */

/**
 * @swagger
 * /api/topics/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Create a new topic
 *     description: Create a new topic with name, description, and category.
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
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Topic created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/topics/get-all:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Get all topics
 *     description: Retrieve all topics.
 *     responses:
 *       200:
 *         description: Topics retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/topics/admin-topics:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Get all topics (admin)
 *     description: Retrieve all topics for admin users.
 *     responses:
 *       200:
 *         description: Topics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/topics/all-topics:
 *   get:
 *     tags: [Topics]
 *     summary: Get all topics
 *     description: Retrieve all topics.
 *     responses:
 *       200:
 *         description: Topics retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/topics/{topicId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Get a topic by ID
 *     description: Retrieve a topic by its ID.
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         description: ID of the topic to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Topic retrieved successfully
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Update a topic
 *     description: Update a topic's name, description, category, or image.
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         description: ID of the topic to update
 *         schema:
 *           type: integer
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
 *                 type: integer
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
 *         description: Internal server error
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Topics]
 *     summary: Delete a topic
 *     description: Delete a topic by its ID.
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         description: ID of the topic to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Topic removed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


const topicController = TopicController.getTopic();

topicRoutes.post(
  "/create",
  checkAuth,
  multer({ storage: multer.diskStorage({}) }).single("image"),
  topicController.create_topic
);

topicRoutes.get("/get-all", checkAuth, topicController.findAllTopics);
topicRoutes.get("/admin-topics", checkAuth, topicController.findAllTopics);
topicRoutes.get("/all-topics", topicController.getAllTopics)

topicRoutes.get("/get-other-topics/:topicId", topicController.getOtherTopics);
topicRoutes
  .route("/:topicId")
  .get(topicController.findTopicById)
  .put(
    checkAuth,
    multer({ storage: multer.diskStorage({}) }).single("image"),
    topicController.updateTopic
  )
  .delete(checkAuth, topicController.removeTopic);

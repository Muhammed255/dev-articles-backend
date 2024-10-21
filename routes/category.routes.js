import express from "express";
import categoryController from "../controllers/category.controller.js";
import { checkAuth } from "../middleware/check-auth.js";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories/new-cat:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               description:
 *                 type: string
 *                 description: A brief description of the category
 *     responses:
 *       200:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/{catId}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       401:
 *         description: No category found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/get-all:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/admin-categories:
 *   get:
 *     summary: Get categories for admin
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           description: Number of categories per page
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/{catId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/{catId}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category removed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /categories/join:
 *   get:
 *     summary: Get topics by category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Topics fetched successfully
 *       500:
 *         description: Error occurred
 */

export const categoryRoutes = express.Router();

categoryRoutes.post("/new-cat", checkAuth, categoryController.create_category);

categoryRoutes.get("/get-all", categoryController.findAllCategories);

categoryRoutes.get(
	"/admin-categories",
	checkAuth,
	categoryController.findAdminCategories
);

categoryRoutes.get("/join", categoryController.getTopicsByCategory);

categoryRoutes
	.route("/:catId")
	.get(categoryController.findCategoryById)
	.put(checkAuth, categoryController.updateCategory)
	.delete(checkAuth, categoryController.removeCategory);

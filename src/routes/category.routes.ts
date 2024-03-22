import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { checkAuth } from "../middleware/check-auth";

export const categoryRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operations related to categories
 */

/**
 * @swagger
 * /api/categories/new-cat:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     summary: Create a new category
 *     description: Create a new category with name and description.
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
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized or no user found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/categories/get-all:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: Retrieve all categories.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/categories/admin-categories:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     summary: Get admin categories
 *     description: Retrieve categories created by admin user.
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized or no admin categories found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/categories/{catId}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     description: Retrieve a category by its ID.
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     summary: Update category
 *     description: Update a category's name and description.
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: ID of the category to update
 *         schema:
 *           type: integer
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Category updated successfully
 *       401:
 *         description: Unauthorized or category not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     summary: Delete category
 *     description: Delete a category by its ID.
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized or category not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/categories/join:
 *   get:
 *     tags: [Categories]
 *     summary: Get topics by category
 *     description: Retrieve topics associated with categories.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

const categoryController = CategoryController.getCategory();

categoryRoutes.post("/new-cat", checkAuth, categoryController.create_category);

categoryRoutes.get("/get-all", categoryController.findAllCategories);

categoryRoutes.get("/admin-categories", checkAuth, categoryController.findAdminCategories);

categoryRoutes.get("/join", categoryController.getTopicsByCategory);

categoryRoutes
  .route("/:catId")
  .get(categoryController.findCategoryById)
  .put(checkAuth, categoryController.updateCategory)
  .delete(checkAuth, categoryController.removeCategory);

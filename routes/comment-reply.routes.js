import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import {
	articleComment,
	articleCommentReply,
	editComment,
	editReply,
	getArticleLatestComments,
	getUserLatestComments,
	removeComment,
	removeReply,
} from "../controllers/comment-reply.controller.js";


/**
 * @swagger
 * /comment-reply/add-comment:
 *   post:
 *     summary: Add a comment to an article
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The article ID
 *               comment:
 *                 type: string
 *                 description: The comment text
 *             required:
 *               - id
 *               - comment
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       404:
 *         description: Article or user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment-reply/edit-comment:
 *   put:
 *     summary: Edit an existing comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The comment ID
 *               comment:
 *                 type: string
 *                 description: The updated comment text
 *             required:
 *               - id
 *               - comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /comment-reply/remove-comment/{id}:
 *   delete:
 *     summary: Remove a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /comment-reply/user-latest-comments:
 *   post:
 *     summary: Get user latest comments
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: number
 *                 description: Number of comments to fetch
 *     responses:
 *       200:
 *         description: User latest comments fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment-reply/latest-comments/{articleId}:
 *   post:
 *     summary: Get latest comments on an article
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The article ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: number
 *                 description: Number of comments to fetch
 *     responses:
 *       200:
 *         description: Latest comments fetched successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /comment-reply/do-reply:
 *   post:
 *     summary: Add a reply to a comment
 *     tags:
 *       - Replies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: The comment ID
 *               reply:
 *                 type: string
 *                 description: The reply text
 *             required:
 *               - commentId
 *               - reply
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       404:
 *         description: Comment or user not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /comment-reply/edit-reply:
 *   put:
 *     summary: Edit an existing reply
 *     tags:
 *       - Replies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The reply ID
 *               reply:
 *                 type: string
 *                 description: The updated reply text
 *             required:
 *               - id
 *               - reply
 *     responses:
 *       200:
 *         description: Reply updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /comment-reply/delete-reply/{id}:
 *   delete:
 *     summary: Remove a reply
 *     tags:
 *       - Replies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reply ID
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 */









export const commentReplyRoutes = express.Router();

commentReplyRoutes.use(checkAuth);

// Comment routes
commentReplyRoutes.post("/add-comment", articleComment);
commentReplyRoutes.put("/edit-comment", editComment);
commentReplyRoutes.delete("/remove-comment/:id", removeComment);

commentReplyRoutes.post(
	"/user-latest-comments",
	getUserLatestComments
);

commentReplyRoutes.post(
	"/latest-comments/:articleId",
	getArticleLatestComments
);

// Reply routes
commentReplyRoutes.post("/do-reply", articleCommentReply);
commentReplyRoutes.put("/edit-reply", editReply);
commentReplyRoutes.delete("/delete-reply/:id", removeReply);

import express from "express";
import { CommentReplyController } from "../controllers/comment-reply.controller";
import { checkAuth } from "../middleware/check-auth";

export const commentReplyRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comment Reply
 *   description: Operations related to comments and replies
 */


/**
 * @swagger
 * /api/comment-reply/add-comment:
 *   post:
 *     summary: Add a comment to an article
 *     tags: [Comment Reply]
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
 *                 type: integer
 *                 description: The ID of the article to comment on
 *               comment:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       '200':
 *         description: A successful response with a message indicating the comment was added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comment-reply/do-reply:
 *   post:
 *     summary: Add reply to article comment
 *     tags: [Comment Reply]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *               commentId:
 *                 type: integer
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/comment-reply/edit-comment:
 *   put:
 *     summary: Edit a comment
 *     tags: [Comment Reply]
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
 *                 type: integer
 *                 description: The ID of the comment to edit
 *               comment:
 *                 type: string
 *                 description: The updated comment text
 *     responses:
 *       '200':
 *         description: A successful response with a message indicating the comment was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comment-reply/remove-comment/{id}:
 *   delete:
 *     summary: Remove a comment
 *     tags: [Comment Reply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of comment to remove
 *     responses:
 *       '200':
 *         description: A successful response with a message indicating the comment was removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comment-reply/edit-reply:
 *   put:
 *     summary: Edit a reply
 *     tags: [Comment Reply]
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
 *                 type: integer
 *                 description: The ID of the reply to edit
 *               reply:
 *                 type: string
 *                 description: The updated reply text
 *     responses:
 *       '200':
 *         description: A successful response with a message indicating the reply was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comment-reply/delete-reply/{id}:
 *   delete:
 *     summary: Delete a reply
 *     tags: [Comment Reply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of reply to remove
 *     responses:
 *       '200':
 *         description: A successful response with a message indicating the reply was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/comment-reply/latest-comments/{articleId}:
 *   post:
 *     summary: get latest comments of specific article
 *     tags: [Comment Reply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of article to get latest comments
 *       - in: formdata
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: number of comments to be retrieved
 *     responses:
 *       '200':
 *         description: Latest comments fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */


const commentReplyController = CommentReplyController.getCommentReplyInstance();

commentReplyRoutes.post(
	"/add-comment",
	checkAuth,
	commentReplyController.articleComment
);

commentReplyRoutes.put(
	"/edit-comment",
	checkAuth,
	commentReplyController.editComment
);

commentReplyRoutes.delete(
	"/remove-comment/:id",
	checkAuth,
	commentReplyController.removeComment
);

commentReplyRoutes.post(
	"/latest-comments/:articleId",
	checkAuth,
	commentReplyController.getArticleLatestComments
);

commentReplyRoutes.post(
	"/do-reply",
	checkAuth,
	commentReplyController.articleCommentReply
);

commentReplyRoutes.put(
	"/edit-reply",
	checkAuth,
	commentReplyController.editReply
);

commentReplyRoutes.delete(
	"/delete-reply/:id",
	checkAuth,
	commentReplyController.removeReply
);
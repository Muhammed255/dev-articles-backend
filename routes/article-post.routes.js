import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import articlePostController from "../controllers/article-post.controller.js";
import multer from "multer";
import { tokenUpdateMiddleware } from "../middleware/token-update.js";



/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         sub_title:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         topic:
 *           $ref: '#/components/schemas/Topic'
 *     UserLikedPost:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         article:
 *           $ref: '#/components/schemas/Article'
 *         type:
 *           type: string
 *     Topic:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 */



/**
 * @swagger
 * /articles/add-post:
 *   post:
 *     summary: Add a new article post
 *     description: Creates a new article post with an image, content, and related topic.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               content:
 *                 type: string
 *               topicId:
 *                 type: string
 *               article_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized or No User found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /articles/get-articles:
 *   get:
 *     summary: Get all public articles
 *     description: Retrieves a list of public articles with pagination and filtering.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of articles to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of articles to return
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by article type (e.g., liked posts)
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 maxArticles:
 *                   type: integer
 *       500:
 *         description: Error occurred while fetching articles
 */

/**
 * @swagger
 * /articles/{postId}:
 *   get:
 *     summary: Get a single article by ID
 *     description: Fetches a specific article by its ID.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to fetch
 *     responses:
 *       200:
 *         description: Article fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: No article found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /articles/{postId}:
 *   put:
 *     summary: Update an article
 *     description: Updates an existing article by ID, with optional image upload.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               content:
 *                 type: string
 *               topicId:
 *                 type: string
 *               article_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 newArticle:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized or No Article found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /articles/{postId}:
 *   delete:
 *     summary: Delete an article
 *     description: Deletes an article by its ID.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to delete
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /articles/search-article:
 *   post:
 *     summary: Search for articles based on multiple criteria.
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchString:
 *                 type: string
 *                 description: The string to search in title, subtitle, content, or author.
 *               postDateFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Start date for filtering articles.
 *               postDateTo:
 *                 type: string
 *                 format: date-time
 *                 description: End date for filtering articles.
 *     parameters:
 *       - name: skip
 *         in: path
 *         description: Number of records to skip.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: take
 *         in: path
 *         description: Number of records to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of articles matching the criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Error occurred during search.
 */

/**
 * @swagger
 * /articles/articles-by:
 *   post:
 *     summary: Get all articles by custom filters.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               where:
 *                 type: object
 *                 description: The filter conditions for fetching articles.
 *     responses:
 *       200:
 *         description: List of articles matching the filter.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserLikedPost'
 *       500:
 *         description: Error occurred during search.
 */

/**
 * @swagger
 * /articles/topic-articles/{topicId}:
 *   get:
 *     summary: Get articles by topic ID.
 *     tags: [Articles]
 *     parameters:
 *       - name: topicId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID to fetch related articles.
 *     responses:
 *       200:
 *         description: Articles fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 topic:
 *                   $ref: '#/components/schemas/Topic'
 *       500:
 *         description: Error occurred.
 *       404:
 *         description: No topic found with the provided ID.
 *       402:
 *         description: Invalid object ID format.
 */

/**
 * @swagger
 * /articles/add-to-bookmark/{postId}:
 *   put:
 *     summary: Add an article to the user's bookmarks.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article successfully added to bookmarks.
 *       400:
 *         description: Article already bookmarked or invalid request.
 *       500:
 *         description: Error occurred.
 */

/**
 * @swagger
 * /articles/remove-from-bookmark/{postId}:
 *   put:
 *     summary: Remove an article from the user's bookmarks.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article successfully removed from bookmarks.
 *       400:
 *         description: Article not found in bookmarks or invalid request.
 *       500:
 *         description: Error occurred.
 */

/**
 * @swagger
 * /articles/like-article:
 *   post:
 *     summary: Like an article
 *     tags: [Articles]
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
 *                 description: The ID of the article to like.
 *     responses:
 *       200:
 *         description: Article liked successfully
 *       400:
 *         description: Error occurred, article already liked or user is the author
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/dislike-article:
 *   post:
 *     summary: Dislike an article
 *     tags: [Articles]
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
 *                 description: The ID of the article to dislike.
 *     responses:
 *       200:
 *         description: Article disliked successfully
 *       400:
 *         description: Error occurred, article already disliked or user is the author
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/user-articles-by-type:
 *   post:
 *     summary: Get user articles by type (like/dislike)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of articles to fetch (like/dislike).
 *     responses:
 *       200:
 *         description: Successfully fetched articles
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/make-article-hidden:
 *   post:
 *     summary: Make an article hidden
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 description: The ID of the article to hide.
 *     responses:
 *       200:
 *         description: Article successfully hidden
 *       400:
 *         description: Article not found or already hidden
 *       402:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/remove-article-hidden:
 *   post:
 *     summary: Remove article from hidden
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 description: The ID of the article to unhide.
 *     responses:
 *       200:
 *         description: Article successfully unhidden
 *       400:
 *         description: Article not found or not hidden
 *       402:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/admin-articles/{adminId}:
 *   get:
 *     summary: Get articles by specific admin
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         description: The ID of the admin whose articles to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched admin articles
 *       401:
 *         description: This user is not an admin
 *       500:
 *         description: Internal server error
 */





export const articlePostRoutes = express.Router();

export const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

articlePostRoutes.post(
	"/add-post",
	checkAuth,
	tokenUpdateMiddleware,
	multer({
		storage: multer.diskStorage({}),
		fileFilter: fileFilter,
		limits: { fileSize: 1000000 },
	}).single("article_image"),
	articlePostController.add_post
);

articlePostRoutes.post(
	"/like-article",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.likeArticle
);

articlePostRoutes.post(
	"/search-article/:skip/:take",
	articlePostController.articles_search
);

articlePostRoutes.post("/articles-by", articlePostController.getAllArticlesBy);
articlePostRoutes.post("/articles-by-auth-user", checkAuth, tokenUpdateMiddleware, articlePostController.getAllArticlesBy);

articlePostRoutes.post(
	"/dislike-article",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.disLikeArticle
);

articlePostRoutes.post(
	"/search-article",
	articlePostController.articles_search
);

articlePostRoutes.post(
	"/user-articles-by-type",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.getUserArticlesByType
);

articlePostRoutes.post(
	"/make-article-hidden",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.makePostHidden
);
articlePostRoutes.post(
	"/remove-article-hidden",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.removePostHidden
);

articlePostRoutes.get("/get-articles", articlePostController.getArticles);

articlePostRoutes.put(
	"/add-to-bookmark/:postId",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.addArticleToBookmark
);

articlePostRoutes.put(
	"/remove-from-bookmark/:postId",
	checkAuth,
	tokenUpdateMiddleware,
	articlePostController.removeArticleFromBookmarks
);

articlePostRoutes.get(
	"/admin-articles/:adminId",
	articlePostController.getSpecificAdminArticles
);

articlePostRoutes.put(
	"/:postId",
	checkAuth,
	tokenUpdateMiddleware,
	multer({ storage: multer.diskStorage({}), fileFilter: fileFilter }).single(
		"article_image"
	),
	articlePostController.updateArticle
);

articlePostRoutes
	.route("/:postId")
	.get(articlePostController.findArticle)
	.delete(checkAuth, tokenUpdateMiddleware, articlePostController.deleteArticle);

articlePostRoutes.get(
	"/topic-articles/:topicId",
	articlePostController.getArticlesByTopic
);

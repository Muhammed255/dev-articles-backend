import express from "express";
import multer from "multer";
import { v4 } from "uuid";
import { ArticlePostController } from "../controllers/article-post.controller";
import { checkAuth } from "../middleware/check-auth";

export const articlePostRoutes = express.Router();

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
 * tags:
 *   name: Article Post
 *   description: Operations related to article posts
 */

/**
 * @swagger
 * /api/articles/add-post:
 *   post:
 *     summary: Create a new article post
 *     tags: [Article Post]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: article_image
 *         type: file
 *         description: The image for the article
 *       - in: formData
 *         name: title
 *         type: string
 *         description: The title of the article
 *       - in: formData
 *         name: sub_title
 *         type: string
 *         description: The subtitle of the article
 *       - in: formData
 *         name: content
 *         type: string
 *         description: The content of the article
 *       - in: formData
 *         name: topicId
 *         type: integer
 *         description: The ID of the topic for the article
 *     responses:
 *       '200':
 *         description: A successful response with the created article
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
 *       '401':
 *         description: Unauthorized user
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/articles/like-article:
 *   post:
 *     summary: Like an article
 *     tags: [Article Post]
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
 *     responses:
 *       200:
 *         description: Article liked
 *       400:
 *         description: Bad request, article already liked or user is the author
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/dislike-article:
 *   post:
 *     summary: Dislike an article
 *     tags: [Article Post]
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
 *     responses:
 *       200:
 *         description: Article disliked
 *       400:
 *         description: Bad request, article already disliked or user is the author
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/search-article/{skip}/{take}:
 *   post:
 *     summary: Search articles
 *     tags: [Article Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchString:
 *                 type: string
 *               postDateFrom:
 *                 type: string
 *                 format: date
 *               postDateTo:
 *                 type: string
 *                 format: date
 *     parameters:
 *       - in: path
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *         description: Number of items to skip
 *       - in: path
 *         name: take
 *         required: true
 *         schema:
 *           type: integer
 *         description: Number of items to take
 *     responses:
 *       200:
 *         description: Articles found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/get-articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Article Post]
 *     responses:
 *       200:
 *         description: Articles fetched successfully
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/add-to-bookmark:
 *   post:
 *     summary: Add an article to bookmarks
 *     tags: [Article Post]
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
 *     responses:
 *       200:
 *         description: Article added to bookmarks
 *       400:
 *         description: Bad request, article already bookmarked
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/remove-from-bookmark:
 *   put:
 *     summary: Remove an article from bookmarks
 *     tags: [Article Post]
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
 *     responses:
 *       200:
 *         description: Article removed from bookmarks
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/user-articles-by-type:
 *   post:
 *     summary: Get user articles by type
 *     tags: [Article Post]
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
 *     responses:
 *       200:
 *         description: User articles found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/articles-by:
 *   post:
 *     summary: Get all articles by criteria
 *     tags: [Article Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               where:
 *                 type: object
 *     responses:
 *       200:
 *         description: Articles found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/admin-articles/{adminId}:
 *   get:
 *     summary: Get articles of a specific admin
 *     tags: [Article Post]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the admin
 *     responses:
 *       200:
 *         description: Articles found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/user-articles/{userId}:
 *   get:
 *     summary: Get articles of a specific user
 *     tags: [Article Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Articles found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/{postId}:
 *   put:
 *     summary: Update article
 *     tags: [Article Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the article to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               article_image:
 *                 type: string
 *                 format: binary
 *               other_field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error occurred
 *   get:
 *     summary: Get article by ID
 *     tags: [Article Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the article to get
 *     responses:
 *       200:
 *         description: Article found
 *       404:
 *         description: Article not found
 *       500:
 *         description: Error occurred
 *   delete:
 *     summary: Delete article by ID
 *     tags: [Article Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the article to delete
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/topic-articles/{topicId}:
 *   get:
 *     summary: Get articles by topic
 *     tags: [Article Post]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the topic
 *     responses:
 *       200:
 *         description: Articles found
 *       500:
 *         description: Error occurred
 */


/**
 * @swagger
 * /api/articles/make-article-hidden:
 *   put:
 *     summary: Make article hidden
 *     tags: [Article Post]
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
 *                 type: integer
 *     responses:
 *       200:
 *         description: Article removed from bookmarks
 *       500:
 *         description: Error occurred
 */

/**
 * @swagger
 * /api/articles/remove-article-hidden:
 *   put:
 *     summary: Remove article hidden
 *     tags: [Article Post]
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
 *                 type: integer
 *     responses:
 *       200:
 *         description: Article removed from bookmarks
 *       500:
 *         description: Error occurred
 */


const articlePostController = ArticlePostController.getArticlesInstance();

articlePostRoutes.post(
	"/add-post",
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
	}).single("article_image"),
	articlePostController.add_post
);

articlePostRoutes.post(
	"/like-article",
	checkAuth,
	articlePostController.likeArticle
);

articlePostRoutes.post(
	"/dislike-article",
	checkAuth,
	articlePostController.disLikeArticle
);

articlePostRoutes.post(
	"/search-article/:skip/:take",
	articlePostController.articles_search
);

articlePostRoutes.get("/get-articles", articlePostController.getArticles);

articlePostRoutes.post(
	"/add-to-bookmark",
	checkAuth,
	articlePostController.addArticleToBookmark
);

articlePostRoutes.put(
	"/remove-from-bookmark",
	checkAuth,
	articlePostController.removeArticleFromBookmarks
);

articlePostRoutes.post(
	"/user-articles-by-type",
	checkAuth,
	articlePostController.getUserArticlesByType
);

articlePostRoutes.post(
	"/articles-by",
	articlePostController.getAllArticlesBy
);

articlePostRoutes.put(
	"/make-article-hidden",
	checkAuth,
	articlePostController.makePostHidden
);

articlePostRoutes.put(
	"/remove-article-hidden",
	checkAuth,
	articlePostController.removePostHidden
);

articlePostRoutes.get(
	"/admin-articles/:adminId",
	articlePostController.getSpecificAdminArticles
);

articlePostRoutes.get(
	"/user-articles/:userId",
	articlePostController.getSpecificUserArticles
);

articlePostRoutes.put(
	"/:postId",
	checkAuth,
	multer({ storage: multer.diskStorage({}), fileFilter: fileFilter }).single(
		"article_image"
	),
	articlePostController.updateArticle
);

articlePostRoutes
	.route("/:postId")
	.get(articlePostController.findArticle)
	.delete(checkAuth, articlePostController.deleteArticle);

articlePostRoutes.get(
	"/topic-articles/:topicId",
	articlePostController.getArticlesByTopic
);

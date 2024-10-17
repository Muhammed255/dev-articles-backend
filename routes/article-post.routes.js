import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import articlePostController from "../controllers/article-post.controller.js";
import multer from "multer";

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
	multer({
		storage: multer.diskStorage({}),
		fileFilter: fileFilter,
		limits: { fileSize: 1000000 },
	}).single("article_image"),
	articlePostController.add_post
);

articlePostRoutes.post(
	"/add-comment",
	checkAuth,
	articlePostController.articleComment
);

articlePostRoutes.post(
	"/do-reply",
	checkAuth,
	articlePostController.articleCommentReply
);

articlePostRoutes.post(
	"/like-article",
	checkAuth,
	articlePostController.likeArticle
);

articlePostRoutes.post(
	"/search-article/:skip/:take",
	articlePostController.articles_search
);

articlePostRoutes.post("/articles-by", articlePostController.getAllArticlesBy);

articlePostRoutes.post(
	"/dislike-article",
	checkAuth,
	articlePostController.disLikeArticle
);

articlePostRoutes.post(
	"/search-article",
	articlePostController.articles_search
);

articlePostRoutes.post(
	"/user-articles-by-type",
	checkAuth,
	articlePostController.getUserArticlesByType
);

articlePostRoutes.post(
	"/make-article-hidden",
	checkAuth,
	articlePostController.makePostHidden
);
articlePostRoutes.post(
	"/remove-article-hidden",
	checkAuth,
	articlePostController.removePostHidden
);

articlePostRoutes.get("/get-articles", articlePostController.getArticles);

articlePostRoutes.put(
	"/add-to-bookmark/:postId",
	checkAuth,
	articlePostController.addArticleToBookmark
);

articlePostRoutes.put(
	"/remove-from-bookmark/:postId",
	checkAuth,
	articlePostController.removeArticleFromBookmarks
);

articlePostRoutes.get(
	"/admin-articles/:adminId",
	articlePostController.getSpecificAdminArticles
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

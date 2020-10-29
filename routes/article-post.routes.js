import express from "express";
import { checkAuth } from "../middleware/check-auth";
import articlePostController from "../controllers/article-post.controller";
import multer from "multer";

export const articlePostRoutes = express.Router();

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/posts");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
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
  multer({ storage: storage, fileFilter: fileFilter }).single("article_image"),
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
  "/dislike-article",
  checkAuth,
  articlePostController.disLikeArticle
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

articlePostRoutes.get('/admin-articles/:adminId', articlePostController.getSpecificAdminArticles);

articlePostRoutes
  .route("/:postId")
  .get(articlePostController.findArticle)
  .put(
    checkAuth,
    multer({ storage: storage, fileFilter: fileFilter }).single(
      "article_image"
    ),
    articlePostController.updateArticle
  )
  .delete(checkAuth, articlePostController.deleteArticle);

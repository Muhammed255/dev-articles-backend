import express from "express";
import { checkAuth } from "../middleware/check-auth";
import {
	articleComment,
	articleCommentReply,
	editComment,
	editReply,
	getArticleLatestComments,
	removeComment,
	removeReply,
} from "../controllers/comment-reply.controller";

export const commentReplyRoutes = express.Router();

commentReplyRoutes.use(checkAuth);

// Comment routes
commentReplyRoutes.post("/add-comment", articleComment);
commentReplyRoutes.put("/edit-comment", editComment);
commentReplyRoutes.delete("/remove-comment/:id", removeComment);
commentReplyRoutes.post(
	"/latest-comments/:articleId",
	getArticleLatestComments
);

// Reply routes
commentReplyRoutes.post("/do-reply", articleCommentReply);
commentReplyRoutes.put("/edit-reply", editReply);
commentReplyRoutes.delete("/delete-reply/:id", removeReply);

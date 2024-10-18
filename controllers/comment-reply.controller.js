import { ArticlePost } from "../models/article-post.model";
import { Comment } from "../models/comment.model";
import { Reply } from "../models/reply.model";
import User from "../models/user.model";

const articleComment = async (req, res) => {
	try {
		const { id: articleId, comment } = req.body;
		const userId = req.userData.userId;

		const article = await ArticlePost.findById(articleId);
		if (!article) {
			return res.status(404).json({ success: false, msg: "Article not found" });
		}

		const authUser = await User.findById(userId);
		if (!authUser) {
			return res.status(404).json({ success: false, msg: "User not found" });
		}

		const newComment = new Comment({
			comment,
			article: article._id,
			commentator: authUser._id,
		});

		await newComment.save();

		return res.status(200).json({
			success: true,
			msg: "Comment added",
			newComment,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const editComment = async (req, res) => {
	try {
		const { id: commentId, comment: commentText } = req.body;
		const userId = req.userData.userId;

		const foundComment = await Comment.findById(commentId).populate(
			"commentator"
		);
		if (!foundComment) {
			return res.status(404).json({ success: false, msg: "Comment not found" });
		}

		if (foundComment.commentator._id.toString() !== userId) {
			return res.status(403).json({ success: false, msg: "Unauthorized" });
		}

		foundComment.comment = commentText;
		const result = await foundComment.save();

		return res.status(200).json({
			success: true,
			msg: "Comment updated",
			updatedComment: result,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const removeComment = async (req, res) => {
	try {
		const { id: commentId } = req.params;
		const userId = req.userData.userId;

		const foundComment = await Comment.findById(commentId).populate(
			"commentator"
		);
		if (!foundComment) {
			return res.status(404).json({ success: false, msg: "Comment not found" });
		}

		if (foundComment.commentator._id.toString() !== userId) {
			return res.status(403).json({ success: false, msg: "Unauthorized" });
		}

		await Reply.deleteMany({ comment: commentId });
		await Comment.findByIdAndDelete(commentId);

		return res.status(200).json({ success: true, msg: "Comment deleted" });
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const getArticleLatestComments = async (req, res) => {
	try {
		const { articleId } = req.params;
		const { limit } = req.body;

		const foundArticle = await ArticlePost.findById(articleId);
		if (!foundArticle) {
			return res.status(404).json({ success: false, msg: "Article not found" });
		}

		const comments = await Comment.find({ article: foundArticle._id })
			.sort({ createdAt: -1 })
			.limit(limit > 0 ? limit : undefined)
			.populate("commentator")
			.populate({
				path: "replies",
				populate: { path: "replier" },
			});

		return res.status(200).json({
			success: true,
			msg: "Latest comments fetched",
			comments,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const editReply = async (req, res) => {
	try {
		const { id: replyId, reply: replyText } = req.body;
		const userId = req.userData.userId;

		const foundReply = await Reply.findById(replyId).populate("replier");
		if (!foundReply) {
			return res.status(404).json({ success: false, msg: "Reply not found" });
		}

		if (foundReply.replier._id.toString() !== userId) {
			return res.status(403).json({ success: false, msg: "Unauthorized" });
		}

		foundReply.reply = replyText;
		const result = await foundReply.save();

		return res.status(200).json({
			success: true,
			msg: "Reply updated",
			updatedReply: result,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const removeReply = async (req, res) => {
	try {
		const { id: replyId } = req.params;
		const userId = req.userData.userId;

		const foundReply = await Reply.findById(replyId).populate("replier");
		if (!foundReply) {
			return res.status(404).json({ success: false, msg: "Reply not found" });
		}

		if (foundReply.replier._id.toString() !== userId) {
			return res.status(403).json({ success: false, msg: "Unauthorized" });
		}

		await Reply.findByIdAndDelete(replyId);

		return res.status(200).json({ success: true, msg: "Reply deleted" });
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

const articleCommentReply = async (req, res) => {
	try {
		const { commentId, reply } = req.body;
		const userId = req.userData.userId;

		const authUser = await User.findById(userId);
		if (!authUser) {
			return res.status(404).json({ success: false, msg: "User not found" });
		}

		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ success: false, msg: "Comment not found" });
		}

		const newReply = new Reply({
			comment: comment._id,
			reply: reply,
			replier: authUser._id,
		});

		await newReply.save();
		await newReply.populate("replier");

		return res
			.status(200)
			.json({ success: true, msg: "Reply added", reply: newReply });
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, msg: "Error occurred: " + err.message });
	}
};

export {
	articleComment,
	articleCommentReply,
	editComment,
	editReply,
	getArticleLatestComments,
	removeComment,
	removeReply,
};

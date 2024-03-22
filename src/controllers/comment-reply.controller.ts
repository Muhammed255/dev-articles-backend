import {
	CommentRepository,
	ReplyRepository,
	dataSource,
} from "../config/ormconfig";
import { Reply } from "../entities/reply.entity";
import {
	BadGatewayException,
	NotFoundException,
} from "../exceptions/http-exception";
import { ArticlePostController } from "./article-post.controller";
import { AuthController } from "./auth.controller";

export class CommentReplyController {
	private static commentReplyInstance: CommentReplyController;

	public constructor() {}

	static getCommentReplyInstance(): CommentReplyController {
		if (!this.commentReplyInstance) {
			CommentReplyController.commentReplyInstance =
				new CommentReplyController();
			return CommentReplyController.commentReplyInstance;
		}
		return CommentReplyController.commentReplyInstance;
	}

	async articleComment(req, res, next) {
		let response = { success: false, msg: "", newComment: null };
		try {
			const { id: articleId, comment } = req.body;
			const authCtrl = AuthController.getAuth;

			const article =
				await ArticlePostController.getArticlesInstance().findOneArticle(
					+articleId
				);
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const newComment = await CommentRepository.save({ comment, article, commentator: authUser });
			response.success = true;
			response.msg = "Comment added";
			response.newComment = newComment;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.msg = "Error occured! " + err;
			return res.status(500).json(response);
		}
	}

	async editComment(req, res, next) {
		try {
			const { id: commentId, comment: commentText } = req.body;
			const authCtrl = AuthController.getAuth;

			const foundComment =
				await CommentReplyController.getCommentReplyInstance().findOneComment(
					+commentId
				);
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			if (foundComment.commentator.id !== authUser.id) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			foundComment.comment = commentText;
			const result = await CommentRepository.save(foundComment);

			return res.status(200).json({
				success: true,
				msg: "Comment updated",
				updatedComment: result,
			});
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}

	async removeComment(req, res, next) {
		const entityManager = dataSource.manager;
		const { id: commentId } = req.params;
		const authCtrl = AuthController.getAuth;
		try {
			await entityManager.transaction(async (transactionalEntityManager) => {
				const foundComment =
					await CommentReplyController.getCommentReplyInstance().findOneComment(
						+commentId
					);
				const authUser = await authCtrl.findOneUser(+req.userData.userId);

				if (foundComment.commentator.id !== authUser.id) {
					return res.status(402).json({ success: false, msg: "Unauthorized!" });
				}

				// Delete the comment itself

				// Find all replies associated with the comment
				const replies = await transactionalEntityManager.find(Reply, {
					where: { comment: foundComment },
				});

				// Delete all replies associated with the comment
				await transactionalEntityManager.remove(replies);
				await transactionalEntityManager.remove(foundComment);
			});

			return res.status(200).json({ success: true, msg: "Comment deleted" });
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}

	async getArticleLatestComments(req, res, next) {
		try {
			const { articleId: artId } = req.params;
			const { limit } = req.body;
			const foundArticle =
				await ArticlePostController.getArticlesInstance().findOneArticle(artId);

			const comments = await CommentRepository.find({
				where: { article: { id: foundArticle.id } },
				order: { createDateTime: "DESC" },
				take: limit && limit > 0 ? limit : undefined,
				relations: ["commentator", "article", "replies", "replies.replier"]
			});
			return res
				.status(200)
				.json({ success: true, msg: "Latest comments fetched", comments });
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}

	async editReply(req, res, next) {
		try {
			const { id: replyId, reply: replyText } = req.body;
			const authCtrl = AuthController.getAuth;

			const foundReply =
				await CommentReplyController.getCommentReplyInstance().findOneReply(
					+replyId
				);
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			if (foundReply.replier.id !== authUser.id) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			foundReply.reply = replyText;
			const result = await ReplyRepository.save(foundReply);

			return res
				.status(200)
				.json({ success: true, msg: "Reply updated", updatedReply: result });
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}

	async removeReply(req, res, next) {
		try {
			const { id: replyId } = req.params;
			const authCtrl = AuthController.getAuth;

			const foundReply =
				await CommentReplyController.getCommentReplyInstance().findOneReply(
					+replyId
				);
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			if (foundReply.replier.id !== authUser.id) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			await ReplyRepository.delete(foundReply);

			return res.status(200).json({ success: true, msg: "Reply deleted" });
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}

	async findOneComment(id: number) {
		try {
			const comment = await CommentRepository.findOne({
				where: { id: id },
				relations: ["commentator", "replies", "replies.replier"],
			});
			if (!comment) {
				throw new NotFoundException("No comment found!");
			}
			return comment;
		} catch (err) {
			throw new BadGatewayException("Error Occured! " + err.message);
		}
	}

	async findOneReply(id: number) {
		try {
			const reply = await ReplyRepository.findOne({
				where: { id: id },
				relations: ["replier"],
			});
			if (!reply) {
				throw new NotFoundException("No reply found!");
			}
			return reply;
		} catch (err) {
			throw new BadGatewayException("Error Occured! " + err.message);
		}
	}

	async articleCommentReply(req, res, next) {
		try {
			const { commentId, reply } = req.body;
			const authCtrl = AuthController.getAuth;

			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const comment = await CommentRepository.findOne({
				where: { id: +commentId },
			});

			if (!comment) {
				return res
					.status(404)
					.json({ success: false, msg: "No comment found!" });
			}

			const newReply = await ReplyRepository.save({
				comment,
				reply: reply,
				replier: authUser,
			}, {reload: true});
			return res.status(200).json({ reply: newReply });
		} catch (err) {
			return res.status(500).json({ msg: "Error occured! " + err });
		}
	}
}

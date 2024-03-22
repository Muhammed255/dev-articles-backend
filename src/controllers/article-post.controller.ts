import moment from "moment";
import { Brackets } from "typeorm";
import {
	ArticlePostRepository,
	UserLikedPostsRepository
} from "../config/ormconfig";
import { RelationType } from "../enum/relation-type.enum";
import { UserRole } from "../enum/user-role.enum";
import {
	BadGatewayException,
	NotFoundException,
} from "../exceptions/http-exception";
import { destroyImage, uploadImage } from "../helper/upload-destroy.helper";
import { AuthController } from "./auth.controller";
import { TopicController } from "./topic.controller";

export class ArticlePostController extends AuthController {
	private static articleInstance: ArticlePostController;

	public constructor() {
		super();
	}

	static getArticlesInstance(): ArticlePostController {
		if (!this.articleInstance) {
			ArticlePostController.articleInstance = new ArticlePostController();
			return ArticlePostController.articleInstance;
		}
		return ArticlePostController.articleInstance;
	}

	async add_post(req, res, next) {
		let response = { success: false, msg: "", article: null };
		const topicCtrl = TopicController.getTopic();
		const authCtrl = AuthController.getAuth;
		try {
			const { title, sub_title, content, topicId } = req.body;
			const user = await authCtrl.findOneUser(+req.userData.userId);

			const foundTopic = await topicCtrl.findOneTopic(+topicId);

			const imageResult = req.file
				? await uploadImage(req.file.path, "dev-articles/articles")
				: null;

			const newPost = await ArticlePostRepository.save({
				title,
				sub_title,
				content,
				cloudinary_id: imageResult.public_id ? imageResult.public_id : null,
				article_image: imageResult.secure_url ? imageResult.secure_url : null,
				topic: foundTopic,
				user: user,
			});

			const addedPost = await ArticlePostRepository.findOne({
				where: { id: newPost.id },
				relations: [
					"user",
					"comments",
					"comments.replies",
					"comments.commentator",
					"comments.replies.replier",
					"userLikedPosts",
				],
			});

			response.msg = "Article created..";
			response.success = true;
			response.article = addedPost;
			res.status(200).json(response);
		} catch (err) {
			console.log(err);
			response.success = false;
			const error = new Error(err);
			response.msg = "Error Occurred!" + error.message;
			return res.status(500).json(response);
		}
	}

	async getArticles(req, res, next) {
		const { type } = req.query;
		let response = { success: false, msg: "", articles: null, maxArticles: 0 };
		const skip = +req.query.skip || 0;
		const take = +req.query.take || 10; // Default take value, adjust as needed
		try {
			let fetchedArticles = ArticlePostRepository.createQueryBuilder("article")
				.leftJoinAndSelect("article.user", "user")
				.leftJoinAndSelect("article.topic", "topic")
				.leftJoinAndSelect("article.comments", "comment")
				.leftJoinAndSelect("comment.replies", "reply")
				.leftJoinAndSelect("comment.commentator", "commentator")
				.leftJoinAndSelect("reply.replier", "replier")
				.leftJoinAndSelect("article.userLikedPosts", "userPosts")
				.leftJoinAndSelect("userPosts.user", "userAction")
				.where("article.is_public = true AND article.hidden=false");

			if (type) {
				fetchedArticles.andWhere("userPosts.type=:type", { type });
			}

			const [count, articles] = await Promise.all([
				fetchedArticles.getCount(),
				fetchedArticles.skip(skip).take(take).getMany(),
			]);

			response.success = true;
			response.msg = "Articles fetched successfully!";
			response.articles = articles;
			response.maxArticles = count;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.articles = null;
			response.maxArticles = 0;
			response.msg = "Error Occurred! " + err.message;
			return res.status(500).json(response);
		}
	}

	async findArticle(req, res, next) {
		let response = { success: false, msg: "", article: null };
		try {
			const article =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.params.postId
				);
				console.log("arrrrrrrrrrrrrrrrrrr", article)
			response.success = true;
			response.msg = "Article fetched....";
			response.article = article;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.article = null;
			const error = new Error(err);
			response.msg = "Error Occurred...." + error.message;
			return res.status(500).json(response);
		}
	}

	async findOneArticle(articleId: number) {
		try {
			const article = await ArticlePostRepository.findOne({
				where: { id: articleId },
				relations: [
					"topic",
					"user",
					"comments",
					"comments.commentator",
					"comments.replies",
					"comments.replies.replier",
					"userLikedPosts",
				],
				// relations: {
				// 	topic: true,
				// 	user: true,
				// 	comments: { commentator: true, replies: { replier: true } },
				// 	userLikedPosts: true,
				// },
			});
			if (!article) {
				throw new NotFoundException("No article found!");
			}
			return article;
		} catch (err) {
			throw new BadGatewayException("Error Occured! " + err.message);
		}
	}

	async updateArticle(req, res, next) {
		let response = { success: false, msg: "", newArticle: null };
		try {
			const { title, sub_title, content, topicId } = req.body;

			const topicCtrl = TopicController.getTopic();
			const authCtrl = AuthController.getAuth;

			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const article =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.params.postId
				);

			if (article.user.id != authUser.id) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if ((article.cloudinary_id && article.article_image) || req.file) {
				if (article.cloudinary_id && article.article_image && req.file) {
					await destroyImage(article.cloudinary_id);
					article.cloudinary_id = "";
					article.article_image = "";
				}
				if (req.file) {
					const imageResult = await uploadImage(
						"dev-articles/articles",
						req.file.path
					);
					article.article_image = imageResult.secure_url;
					article.cloudinary_id = imageResult.public_id;
				}

				await ArticlePostRepository.save(article);
			}

			let fetchedTopic = topicId
				? await topicCtrl.findOneTopic(+topicId)
				: article.topic;

			await ArticlePostRepository.update(
				{ id: article.id },
				{
					...(title && { title }),
					...(sub_title && { sub_title }),
					...(content && { content }),
					...(topicId && { topic: fetchedTopic }),
				}
			);

			response.success = true;
			response.msg = "Article updated successfully";
			response.newArticle =
				await ArticlePostController.articleInstance.findOneArticle(article.id);

			return res.status(200).json(response);
		} catch (e) {
			response.success = false;
			const error = new Error(e);
			response.msg = "Error Occured!" + error;
			return res.status(500).json(response);
		}
	}

	async deleteArticle(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const article =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.params.postId
				);
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			if (article.user.id != authUser.id) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			await destroyImage(article.cloudinary_id);

			await ArticlePostRepository.delete(+req.params.postId);
			response.success = true;
			response.msg = "Article removed successfully";
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred!";
			const error = new Error(err);
			next(error);
			return res.status(500).json(response);
		}
	}

	async getArticlesByTopic(req, res, next) {
		try {
			const topicCtrl = TopicController.getTopic();

			const topic = await topicCtrl.findOneTopic(+req.params.topicId);

			const fetchedArtices = await ArticlePostRepository.find({
				where: { topic: { id: topic.id } },
				relations: { user: true, topic: true },
			});
			return res.status(200).json({
				success: true,
				msg: "Fetched!",
				articles: fetchedArtices,
				topic: topic,
			});
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error Occured!" + err.message });
		}
	}

	async articles_search(req, res, next) {
		try {
			let { searchString, postDateFrom, postDateTo } = req.body;
			let { skip, take } = req.params;
			const articleQuery = ArticlePostRepository.createQueryBuilder("article")
				.leftJoinAndSelect("article.topic", "topic")
				.leftJoinAndSelect("article.user", "user")
				.leftJoinAndSelect("article.comments", "comments")
				.leftJoinAndSelect("comments.commentator", "commentator")
				.leftJoinAndSelect("article.userLikedPosts", "userPosts")
				.leftJoinAndSelect("userPosts.user", "userAction")
				.leftJoinAndSelect("comments.replies", "replies")
				.leftJoinAndSelect("replies.replier", "replier")
				.where("article.is_public = :result", { result: true });
			if (searchString) {
				articleQuery.andWhere(
					new Brackets((qb) => {
						qb.where(`article.title LIKE '%${searchString}%'`)
							.orWhere(`article.sub_title LIKE '%${searchString}%'`)
							.orWhere(`article.content LIKE '%${searchString}%'`)
							.orWhere(`user.name LIKE '%${searchString}%'`)
							.orWhere(`user.username LIKE '%${searchString}%'`);
					})
				);
			}

			if (postDateFrom && !postDateTo) {
				const currentDate = new Date();
				articleQuery.andWhere(
					`article."createDateTime"  BETWEEN :start AND :end`,
					{
						start: moment.utc(postDateFrom).startOf("day").add(1, "day"),
						end: moment.utc(currentDate).endOf("day").add(1, "day"),
					}
				);
			}

			if (postDateFrom && postDateTo) {
				articleQuery.andWhere(
					`article."createDateTime"  BETWEEN :start AND :end`,
					{
						start: moment.utc(postDateFrom).startOf("day").add(1, "day"),
						end: moment.utc(postDateTo).endOf("day").add(1, "day"),
					}
				);
			}

			const count = await articleQuery.getCount();
			const articles = await articleQuery
				.skip(skip)
				.take(take)
				.addOrderBy("article.createDateTime", "ASC")
				.getMany();
			return res.status(200).json({ totalCount: count, articles });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured: " + err.message });
		}
	}

	async addArticleToBookmark(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const user = await authCtrl.findOneUser(+req.userData.userId);

			const fetchedArticle =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.postId
				);

			const foundUserBookmarks = await UserLikedPostsRepository.findOne({
				where: {
					userId: user.id,
					postId: fetchedArticle.id,
					type: RelationType.BOOKMARK,
				},
			});

			if (foundUserBookmarks) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already bookmarked!" });
			}

			await UserLikedPostsRepository.save({
				article: fetchedArticle,
				user,
				userId: user.id,
				postId: fetchedArticle.id,
				type: RelationType.BOOKMARK,
			});

			return res
				.status(200)
				.json({ success: true, msg: "Article added to bookmarks" });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async removeArticleFromBookmarks(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const user = await authCtrl.findOneUser(+req.userData.userId);

			const fetchedArticle =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.postId
				);

			const foundUserBookmarks = await UserLikedPostsRepository.findOne({
				where: {
					userId: user.id,
					postId: fetchedArticle.id,
					type: RelationType.BOOKMARK,
				},
			});

			if (!foundUserBookmarks) {
				return res
					.status(400)
					.json({ success: false, msg: "Article is not in your bookmarked" });
			}

			await UserLikedPostsRepository.delete({ id: foundUserBookmarks.id });

			return res
				.status(200)
				.json({ success: true, msg: "Article removed from bookmarks" });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async likeArticle(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const user = await authCtrl.findOneUser(+req.userData.userId);

			const fetchedArticle =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.id
				);

			if (user.id == fetchedArticle.user.id) {
				return res
					.status(400)
					.json({ success: false, msg: "You can not like your article" });
			}

			const fetchedUserLikedPost = await UserLikedPostsRepository.findOne({
				where: {
					postId: fetchedArticle.id,
					userId: user.id,
					type: RelationType.LIKE,
				},
			});

			if (fetchedUserLikedPost) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already liked!" });
			}

			const fetchedUserDisLikedPost = await UserLikedPostsRepository.findOne({
				where: {
					postId: fetchedArticle.id,
					userId: user.id,
					type: RelationType.DISLIKE,
				},
			});

			if (fetchedUserDisLikedPost) {
				await UserLikedPostsRepository.delete({
					id: fetchedUserDisLikedPost.id,
				});
			}

			await UserLikedPostsRepository.save({
				article: fetchedArticle,
				postId: fetchedArticle.id,
				user: user,
				userId: user.id,
				type: RelationType.LIKE,
			});

			return res.status(200).json({ success: true, msg: "Article liked!" });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async getUserArticlesByType(req, res, next) {
		try {
			const type: RelationType = req.body.type;
			const userId = req.params.userId;

			const authCtrl = AuthController.getAuth;
			const user = await authCtrl.findOneUser(+userId);

			const fetchedUserLikedPost = await UserLikedPostsRepository.find({
				where: { userId: user.id, type: type },
				relations: ["user", "article"],
			});
			return res.status(200).json({ articles: fetchedUserLikedPost });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async getAllArticlesBy(req, res, next) {
		try {
			const where = req.body.where;

			const fetchedUserLikedPost = await UserLikedPostsRepository.find({
				where: where,
				relations: ["user", "article"],
			});
			return res.status(200).json({ articles: fetchedUserLikedPost });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async disLikeArticle(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const user = await authCtrl.findOneUser(+req.userData.userId);

			const fetchedArticle =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.id
				);

			if (user.id == fetchedArticle.user.id) {
				return res
					.status(400)
					.json({ success: false, msg: "You can not dislike your article" });
			}

			const fetchedUserDisLikedPost = await UserLikedPostsRepository.findOne({
				where: {
					postId: fetchedArticle.id,
					userId: user.id,
					type: RelationType.DISLIKE,
				},
			});

			if (fetchedUserDisLikedPost) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already disliked!" });
			}

			const fetchedUserLikedPost = await UserLikedPostsRepository.findOne({
				where: {
					postId: fetchedArticle.id,
					userId: user.id,
					type: RelationType.LIKE,
				},
			});

			if (fetchedUserLikedPost) {
				await UserLikedPostsRepository.delete({ id: fetchedUserLikedPost.id });
			}

			await UserLikedPostsRepository.save({
				article: fetchedArticle,
				postId: fetchedArticle.id,
				user: user,
				userId: user.id,
				type: RelationType.DISLIKE,
			});

			return res.status(200).json({ success: true, msg: "Article disliked!" });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async getSpecificAdminArticles(req, res, next) {
		try {
			const checkUser = await super.findOneUser(+req.params.adminId);
			if (checkUser.role !== UserRole.ADMIN) {
				return res
					.status(401)
					.json({ success: false, msg: "Not allowed", articles: null });
			}
			const [articles, count] = await ArticlePostRepository.findAndCount({
				// where: { user: { id: checkUser.id } },
				relations: [
					"user",
					"topic",
					"userLikedPosts",
					"comments",
					"comments.commentator",
					"comments.replies",
					"comments.replies.replier",
				],
			});

			return res
				.status(200)
				.json({ success: true, msg: "Fetched", articles, maxArticles: count });
		} catch (err) {
			console.log(err);
			const error = new Error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error Occured" + error, articles: null });
		}
	}

	async getSpecificUserArticles(req, res, next) {
		try {
			const checkUser = await super.findOneUser(req.params.userId);
			if (checkUser.role != "user") {
				return res
					.status(401)
					.json({ success: false, msg: "Not allowed", articles: null });
			}
			const [articles, count] = await ArticlePostRepository.findAndCount({
				where: { user: { id: checkUser.id } },
				relations: [
					"user",
					"topic",
					"userLikedPosts",
					"comments",
					"comments.commentator",
					"comments.replies",
					"comments.replies.replier",
				],
			});

			return res
				.status(200)
				.json({ success: true, msg: "Fetched", articles, maxArticles: count });
		} catch (err) {
			console.log(err);
			const error = new Error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error Occured" + error, articles: null });
		}
	}

	async makePostHidden(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const article =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.articleId
				);

			if (authUser.id !== article.user.id) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			if (article.hidden) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already hidden" });
			}

			await ArticlePostRepository.update({ id: article.id }, { hidden: true });
			return res
				.status(200)
				.json({ success: true, msg: "Article hidden from your profile!" });
		} catch (err) {
			console.log(err);
			const error = new Error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error Occured" + error, articles: null });
		}
	}

	async removePostHidden(req, res, next) {
		try {
			const authCtrl = AuthController.getAuth;
			const authUser = await authCtrl.findOneUser(+req.userData.userId);

			const article =
				await ArticlePostController.articleInstance.findOneArticle(
					+req.body.articleId
				);

			if (authUser.id !== article.user.id) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			if (!article.hidden) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already not hidden" });
			}

			await ArticlePostRepository.update({ id: article.id }, { hidden: true });
			return res
				.status(200)
				.json({ success: true, msg: "Article removed from hidden" });
		} catch (err) {
			console.log(err);
			const error = new Error(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error Occured" + error, articles: null });
		}
	}
}

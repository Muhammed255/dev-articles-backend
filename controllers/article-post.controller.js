import mongoose from "mongoose";
const { isValidObjectId } = mongoose;
import cloudinaryApi from "../config/cloudinary-api.js";
import Topic from "../models/topic.model.js";
import User from "../models/user.model.js";
import { ArticlePost, UserLikedPost } from "../models/article-post.model.js";
import moment from "moment";

export default {
	async add_post(req, res, next) {
		let response = { success: false, msg: "", article: null };
		try {
			const { title, sub_title, content, topicId } = req.body;
			const user = await User.findById(req.userData.userId);
			if (!user) {
				response.msg = "No User found";
				return res.status(401).json({ ...response });
			}

			const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
				folder: "dev-articles/articles",
			});

			const newPost = new ArticlePost({
				title,
				sub_title,
				content,
				cloudinary_id: imageResult.public_id,
				article_image: imageResult.secure_url,
				topicId,
				autherId: req.userData.userId,
			});
			const post = await newPost.save();

			response.msg = "Article created..";
			response.success = true;
			response.article = post;
			res.status(200).json({ ...response });
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred!";
			const error = new Error();
			error.message = err;
			next(error);
			return res.status(500).json({ ...response });
		}
	},

	async getArticles(req, res, _next) {
		const { type } = req.query;
		let response = { success: false, msg: "", articles: null, maxArticles: 0 };
		const skip = +req.query.skip || 0;
		const take = +req.query.take || 10;
		try {
			let query = { is_public: true, hidden: false };
			if (type) {
				query["userLikedPosts.type"] = type;
			}

			const count = await ArticlePost.countDocuments(query);
			const articles = await ArticlePost.find(query)
				.populate("autherId")
				.populate("topicId")
				.populate({
					path: "comments",
					populate: [
						{ path: "replies" },
						{ path: "commentator" },
						{ path: "replies.replier" },
					],
				})
				.populate({
					path: "userLikedPosts",
					populate: { path: "user" },
				})
				.skip(skip)
				.limit(take);

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
	},

	findArticle(req, res, next) {
		let response = { success: false, msg: "", article: null };
		ArticlePost.findById(req.params.postId)
			.populate("autherId")
			.populate("topicId")
			.populate({
				path: "comments",
				populate: [
					{ path: "replies" },
					{ path: "commentator" },
					{ path: "replies.replier" },
				],
			})
			.populate({
				path: "userLikedPosts",
				populate: { path: "user" },
			})
			.then((article) => {
				if (!article) {
					response.msg = "Error: No article found";
					return res.status(401).json({ ...response });
				}

				response.success = true;
				response.msg = "Article fetched....";
				response.article = article;
				res.status(200).json({ ...response });
			})
			.catch((err) => {
				response.success = false;
				response.msg = "Error Occurred....";
				response.article = null;
				const error = new Error();
				error.message = err;
				next(error);
				res.status(500).json({ ...response });
			});
	},

	async updateArticle(req, res, next) {
		let response = { success: false, msg: "", newArticle: null };
		try {
			const { title, sub_title, content, topicId } = req.body;

			const authUser = await User.findById(req.userData.userId);
			if (!authUser) {
				response.msg = "No user found";
				return res.status(401).send({ response });
			}

			const article = await ArticlePost.findById(req.params.postId);
			if (!article) {
				return res
					.status(404)
					.json({ success: false, msg: "No Article found!" });
			}

			if (article.autherId.toString() !== req.userData.userId.toString()) {
				response.msg = "Unauthorized..";
				return res.status(401).send({ response });
			}

			if (title) {
				article.title = title;
			}

			if (sub_title) {
				article.sub_title = sub_title;
			}

			if (content) {
				article.content = content;
			}

			if (topicId) {
				isValidObjectId(topicId) ? (article.topicId = topicId) : "Not objectId";
			}

			if (req.file) {
				article.cloudinary_id &&
					(await cloudinaryApi.uploader.destroy(article.cloudinary_id, {
						resource_type: "image",
						invalidate: true,
					}));
			}
			if (!req.body.article_image) {
				const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
					folder: "dev-articles/articles",
					transformation: [{ width: 500, height: 500, crop: "limit" }],
				});

				article.article_image = imageResult.secure_url;
				article.cloudinary_id = imageResult.public_id;
			}

			const newArticle = await article.save();

			response.success = true;
			response.msg = "Article updated successfully";
			response.newArticle = newArticle;

			res.status(200).json({ ...response });
		} catch (e) {
			response.success = false;
			response.msg = "Error Occurred!";
			const error = new Error(e);
			next(error);
			return res.status(500).json({ ...response });
		}
	},

	async deleteArticle(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const article = await ArticlePost.findById(req.params.postId);

			const authUser = await User.findById(req.userData.userId);
			if (!authUser) {
				response.msg = "No user found";
				return res.status(401).send({ ...response });
			}

			if (article.autherId._id.toString() !== authUser._id.toString()) {
				response.msg = "Unauthorized..";
				return res.status(401).send({ ...response });
			}

			await cloudinaryApi.uploader.destroy(article.cloudinary_id, {
				resource_type: "image",
				invalidate: true,
			});

			await ArticlePost.findByIdAndDelete(req.params.postId);
			response.success = true;
			response.msg = "Article removed successfully";
			res.status(200).json({ ...response });
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred!";
			const error = new Error(err);
			next(error);
			return res.status(500).json({ ...response });
		}
	},

	async articles_search(req, res, _next) {
		try {
			let { searchString, postDateFrom, postDateTo } = req.body;
			let { skip, take } = req.params;
			let query = { is_public: true };

			if (searchString) {
				query["$or"] = [
					{ title: new RegExp(searchString, "i") },
					{ sub_title: new RegExp(searchString, "i") },
					{ content: new RegExp(searchString, "i") },
					{ "user.name": new RegExp(searchString, "i") },
					{ "user.username": new RegExp(searchString, "i") },
				];
			}

			if (postDateFrom && !postDateTo) {
				query.createdAt = {
					$gte: moment.utc(postDateFrom).startOf("day").add(1, "day").toDate(),
					$lte: moment.utc().endOf("day").add(1, "day").toDate(),
				};
			}

			if (postDateFrom && postDateTo) {
				query.createdAt = {
					$gte: moment.utc(postDateFrom).startOf("day").add(1, "day").toDate(),
					$lte: moment.utc(postDateTo).endOf("day").add(1, "day").toDate(),
				};
			}

			const count = await ArticlePost.countDocuments(query);
			const articles = await ArticlePost.find(query)
				.populate("topic")
				.populate("user")
				.populate({
					path: "comments",
					populate: [
						{ path: "commentator" },
						{ path: "replies", populate: { path: "replier" } },
					],
				})
				.populate({
					path: "userLikedPosts",
					populate: { path: "user" },
				})
				.skip(parseInt(skip))
				.limit(parseInt(take))
				.sort({ createdAt: 1 });

			return res.status(200).json({ totalCount: count, articles });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occurred: " + err.message });
		}
	},

	async getAllArticlesBy(req, res, _next) {
		try {
			const where = req.body.where;

			// Convert the 'where' object to a Mongoose-compatible query
			const query = {};
			for (const key in where) {
				if (where.hasOwnProperty(key)) {
					// Handle nested properties if necessary
					if (typeof where[key] === "object" && !Array.isArray(where[key])) {
						for (const nestedKey in where[key]) {
							query[`${key}.${nestedKey}`] = where[key][nestedKey];
						}
					} else {
						query[key] = where[key];
					}
				}
			}

			const fetchedUserLikedPost = await UserLikedPost.find(query)
				.populate("user")
				.populate("article");

			return res.status(200).json({ articles: fetchedUserLikedPost });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occurred! " + err });
		}
	},

	async getArticlesByTopic(req, res, _next) {
		try {
			if (!isValidObjectId(req.params.topicId)) {
				return res
					.status(402)
					.json({ success: false, msg: "Not valid objectId" });
			}
			const topic = await Topic.findById(req.params.topicId);
			if (!topic) {
				return res
					.status(404)
					.json({ success: false, msg: "No Topic found!!" });
			}
			const fetchedArtices = await ArticlePost.find({
				topicId: topic._id,
			})
				.populate("autherId")
				.populate("topicId")
				.populate({
					path: "comments",
					populate: [
						{ path: "replies" },
						{ path: "commentator" },
						{ path: "replies.replier" },
					],
				})
				.populate({
					path: "userLikedPosts",
					populate: { path: "user" },
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
	},

	async articles_search(req, res, _next) {
		try {
			const { searchString } = req.body;
			const docs = await ArticlePost.find({
				$or: [
					{ title: { $regex: searchString, $options: "i" } },
					{ sub_title: { $regex: searchString, $options: "i" } },
					{ content: { $regex: searchString, $options: "i" } },
				],
			});
			if (!docs) {
				return res
					.status(401)
					.json({ success: false, msg: "Could not fetch!" });
			}
			return res
				.status(200)
				.json({ success: true, msg: "fetched", articles: docs });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occured: " + err.message });
		}
	},

	async addArticleToBookmark(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				return res.status(400).json({ ...response });
			}
			const post = await ArticlePost.findById(req.params.postId);
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			const foundUserBookmarks = await UserLikedPost.findOne({
				user: user._id,
				article: fetchedArticle._id,
				type: "bookmark",
			});

			if (foundUserBookmarks) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already bookmarked!" });
			}
			const newBookmark = new UserLikedPost({
				article: post._id,
				user: user._id,
				type: "bookmark",
			});

			await newBookmark.save();

			return res
				.status(200)
				.json({ success: true, msg: "Article added to bookmarks" });
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred..";
			const error = new Error(err);
			next(error);
			return res.status(500).json({ ...response });
		}
	},

	async removeArticleFromBookmarks(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}
			const post = await ArticlePost.findById(req.params.postId);
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			const foundUserBookmarks = await UserLikedPost.findOne({
				user: user._id,
				article: post._id,
				type: "bookmark",
			});

			if (!foundUserBookmarks) {
				return res
					.status(400)
					.json({ success: false, msg: "Article is not in your bookmarks" });
			}

			await UserLikedPost.deleteOne({ _id: foundUserBookmarks._id });

			return res
				.status(200)
				.json({ success: true, msg: "Article removed from bookmarks" });
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred..";
			const error = new Error(err);
			next(error);
			return res.status(500).json({ ...response });
		}
	},

	async likeArticle(req, res, _next) {
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}
			const post = await ArticlePost.findById(req.body.id).populate("autherId");
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			if (user._id.toString() === post.autherId._id.toString()) {
				return res
					.status(400)
					.json({ success: false, msg: "You cannot like your own article" });
			}

			const fetchedUserLikedPost = await UserLikedPost.findOne({
				article: post._id,
				user: user._id,
				type: "like",
			});

			if (fetchedUserLikedPost) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already liked!" });
			}

			const fetchedUserDisLikedPost = await UserLikedPost.findOne({
				article: post._id,
				user: user._id,
				type: "dislike",
			});

			if (fetchedUserDisLikedPost) {
				await UserLikedPost.deleteOne({ _id: fetchedUserDisLikedPost._id });
			}

			const newLike = new UserLikedPost({
				article: post._id,
				user: user._id,
				type: "like",
			});

			await newLike.save();

			const updatedArticle = await this.findOneArticle(req.body.id);

			return res
				.status(200)
				.json({ success: true, msg: "Article liked!", updatedArticle });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occurred! " + err });
		}
	},

	async disLikeArticle(req, res, _next) {
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}
			const post = await ArticlePost.findById(req.body.id).populate("autherId");
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			if (user._id.toString() === post.autherId._id.toString()) {
				return res
					.status(400)
					.json({ success: false, msg: "You cannot dislike your own article" });
			}

			const fetchedUserDisLikedPost = await UserLikedPost.findOne({
				article: post._id,
				user: user._id,
				type: "dislike",
			});

			if (fetchedUserDisLikedPost) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already disliked!" });
			}

			const fetchedUserLikedPost = await UserLikedPost.findOne({
				article: post._id,
				user: user._id,
				type: "like",
			});

			if (fetchedUserLikedPost) {
				await UserLikedPost.deleteOne({ _id: fetchedUserLikedPost._id });
			}

			const newDislike = new UserLikedPost({
				article: post._id,
				user: user._id,
				type: "dislike",
			});

			await newDislike.save();

			const updatedArticle = await ArticlePost.findById(req.body.id).populate(
				"autherId"
			);

			return res
				.status(200)
				.json({ success: true, msg: "Article disliked!", updatedArticle });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occurred! " + err });
		}
	},

	async getUserArticlesByType(req, res, _next) {
		try {
			const type = req.body.type;
			const userId = req.params.userId;

			const user = await User.findOne({ _id: userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}

			const fetchedUserLikedPost = await UserLikedPost.find({
				user: user._id,
				type: type,
			})
				.populate("user")
				.populate("article");

			return res.status(200).json({ articles: fetchedUserLikedPost });
		} catch (err) {
			return res
				.status(500)
				.json({ success: false, msg: "Error occurred! " + err });
		}
	},

	async getSpecificAdminArticles(req, res, next) {
		let response = { success: false, msg: "", articles: null };
		try {
			const checkAdmin = await User.findById(req.params.adminId);
			if (checkAdmin.role !== "admin") {
				response.msg = "This User is Not Admin";
				return res.status(401).json({ ...response });
			}
			const articles = await ArticlePost.find({ autherId: req.params.adminId })
				.populate("autherId")
				.populate("comments.commentator")
				.populate("comments.replies.replier");

			response.success = true;
			response.msg = "Fetched ...";
			response.articles = articles;

			return res.status(200).json({ ...response });
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred!";
			response.articles = null;
			const error = new Error(err);
			next(error);
			return res.status(500).json({ ...response });
		}
	},
	async makePostHidden(req, res, _next) {
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}
			const article = await ArticlePost.findById(req.body.articleId).populate(
				"autherId"
			);
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			if (authUser._id.toString() !== article.autherId._id.toString()) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			if (article.hidden) {
				return res
					.status(400)
					.json({ success: false, msg: "Article already hidden" });
			}

			await ArticlePost.findByIdAndUpdate(article._id, { hidden: true });

			return res
				.status(200)
				.json({ success: true, msg: "Article hidden from your profile!" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				msg: "Error Occurred: " + err.message,
				articles: null,
			});
		}
	},

	async removePostHidden(req, res, _next) {
		try {
			const user = await User.findOne({ _id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				res.status(400).json({ ...response });
			}
			const article = await ArticlePost.findById(req.body.articleId).populate(
				"autherId"
			);
			if (!post) {
				response.msg = "No post found..";
				res.status(400).json({ ...response });
			}

			if (authUser._id.toString() !== article.autherId._id.toString()) {
				return res.status(402).json({ success: false, msg: "Unauthorized!" });
			}

			if (!article.hidden) {
				return res
					.status(400)
					.json({ success: false, msg: "Article is not hidden" });
			}

			await ArticlePost.findByIdAndUpdate(article._id, { hidden: false });

			return res
				.status(200)
				.json({ success: true, msg: "Article removed from hidden" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				msg: "Error Occurred: " + err.message,
				articles: null,
			});
		}
	},
};

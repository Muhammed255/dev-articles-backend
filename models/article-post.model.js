import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
const articlePostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		sub_title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		article_image: {
			type: String,
			required: true,
		},
		cloudinary_id: {
			type: String,
		},
		topicId: {
			type: ObjectId,
			ref: "Topic",
			required: true,
		},
		autherId: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		comments: [
			{
				type: ObjectId,
				ref: "Comment",
				default: []
			},
		],
		likedBy: [
			{
				type: ObjectId,
				ref: "User",
				default: []
			},
		],
		dislikedBy: [
			{
				type: ObjectId,
				ref: "User",
				default: []
			},
		],
		likes: {
			type: Number,
			default: 0,
		},
		dislikes: {
			type: Number,
			default: 0,
		},
		is_public: { type: Boolean, default: true },
		hidden: { type: Boolean, default: false },
		userLikedPosts: [
			{ type: ObjectId, ref: "UserLikedPost", default: [] },
		],
	},
	{ timestamps: true }
);

const UserLikedPostSchema = new mongoose.Schema(
	{
		user: { type: ObjectId, ref: "User" },
		article: { type: ObjectId, ref: "ArticlePost" },
		type: String,
	},
	{ timestamps: true }
);

articlePostSchema.statics.countAllComments = async function () {
	const result = await this.aggregate([
		{
			$project: {
				commentCount: { $size: "$comments" },
				replyCount: {
					$reduce: {
						input: "$comments",
						initialValue: 0,
						in: { $add: ["$$value", { $size: "$$this.replies" }] },
					},
				},
			},
		},
		{
			$group: {
				_id: null,
				totalComments: { $sum: "$commentCount" },
				totalReplies: { $sum: "$replyCount" },
			},
		},
		{
			$project: {
				_id: 0,
				totalComments: 1,
				totalReplies: 1,
				totalInteractions: { $add: ["$totalComments", "$totalReplies"] },
			},
		},
	]);

	return (
		result[0] || { totalComments: 0, totalReplies: 0, totalInteractions: 0 }
	);
};

articlePostSchema.index({ title: "text", sub_title: "text", content: "text" });

const ArticlePost = mongoose.model("ArticlePost", articlePostSchema);
const UserLikedPost = mongoose.model("UserLikedPost", UserLikedPostSchema);

export { ArticlePost, UserLikedPost };

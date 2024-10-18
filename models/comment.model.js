import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentLengthChecker = (comment) => {
	if (!comment) {
		return false;
	} else {
		if (comment.length < 1 || comment.length > 200) {
			return false;
		} else {
			return true;
		}
	}
};

const CommentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
			validate: [
				{
					validator: commentLengthChecker,
					message: "Comments may not exceed 200 characters.",
				},
			],
		},
		article: {
			type: Schema.Types.ObjectId,
			ref: "ArticlePost",
			required: true,
		},
		commentator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		replies: [
			{
				type: Schema.Types.ObjectId,
				ref: "Reply",
			},
		],
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export { Comment };

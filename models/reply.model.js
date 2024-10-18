import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Validate Function to check reply length
const replyLengthChecker = (reply) => {
	if (!reply) {
		return false;
	} else {
		if (reply.length < 1 || reply.length > 200) {
			return false;
		} else {
			return true;
		}
	}
};

const ReplySchema = new Schema(
	{
		reply: {
			type: String,
			required: true,
			validate: [
				{
					validator: replyLengthChecker,
					message: "Replies may not exceed 200 characters.",
				},
			],
		},
		replier: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		comment: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
			required: true,
		},
	},
	{ timestamps: true }
);

// Middleware to handle cascading delete
ReplySchema.pre("findOneAndDelete", async function (next) {
	const replyId = this.getQuery()["_id"];
	try {
		await mongoose
			.model("Comment")
			.updateOne({ replies: replyId }, { $pull: { replies: replyId } });
		next();
	} catch (error) {
		next(error);
	}
});

const Reply = mongoose.model("Reply", ReplySchema);

export { Reply };

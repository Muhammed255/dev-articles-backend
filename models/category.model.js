import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

var categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		userId: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

//Export the model
export default mongoose.model("Category", categorySchema);

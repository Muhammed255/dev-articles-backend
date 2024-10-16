import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
  bio: {
    type: String,
  },
	gender: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  linkedInUrl: { type: String, required: false },
  stackoverflowUrl: { type: String, required: false },
  bookmarks: [
    {
      type: ObjectId,
      ref: "ArticlePost",
      default: [],
    },
  ],
  likes: [
    {
      type: ObjectId,
      ref: "ArticlePost",
      default: [],
    },
  ],
  imageUrl: {
    type: String,
  },
	cloudinary_id: {
		type: String
	},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
	followers: [
    {
      type: ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  accessToken: {
    type: String,
  },
  bio: {
    type: String,
  },
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);

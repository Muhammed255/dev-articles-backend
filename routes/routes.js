import { articlePostRoutes } from "./article-post.routes.js";
import { authRouter } from "./auth.routes.js";
import { categoryRoutes } from "./category.routes.js";
import { commentReplyRoutes } from "./comment-reply.routes.js";
import { topicRoutes } from "./topic.routes.js";
import { userRoutes } from "./user.routes.js";

export default function routes(app) {
	app.use("/api/auth", authRouter);

	app.use("/api/user", userRoutes);

	app.use("/api/categories", categoryRoutes);

	app.use("/api/topics", topicRoutes);

	app.use("/api/articles", articlePostRoutes);

	app.use("/api/comment-reply", commentReplyRoutes);
}

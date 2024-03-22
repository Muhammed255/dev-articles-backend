import compression from "compression";
import cors from "cors";
import express from "express";
import * as path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { dataSource } from "./config/ormconfig";
import morganMiddleware from "./middleware/morgan-middleware";
import { articlePostRoutes } from "./routes/article-post.routes";
import { authRouter } from "./routes/auth.routes";
import { categoryRoutes } from "./routes/category.routes";
import { commentReplyRoutes } from "./routes/comment-reply.routes";
import { topicRoutes } from "./routes/topic.routes";
import { userRoutes } from "./routes/user.routes";

const app = express();

const specs = swaggerJsdoc({
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Your API Documentation",
			version: "1.0.0",
			description: "API documentation for Developers Articles",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		tags: [{ name: "DEVELOPERS ARTICLES", description: "test" }],
		basePath: "/",
		schemes: [],
	},
	apis: [path.join(__dirname, "./routes/*.ts")], // Path to the API routes
});
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, {
		customCss:
			".swagger-ui {margin-bottom: 5rem} .swagger-ui .topbar {display: none}",
	})
);

const port = process.env.PORT || "3000";

app.use(compression());

// Set Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morganMiddleware);

//Setup CORS
app.use(cors({ origin: "*" }));

app.use("/api/auth", authRouter);

app.use("/api/user", userRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api/articles", articlePostRoutes);

app.use("/api/comment-reply", commentReplyRoutes);

dataSource
	.initialize()
	.then(() => {
		console.log("Connected to postgresql db ....");
		app.listen(port, () => {
			console.log("running on port 3000");
		});
	})
	.catch((err) => {
		console.log("Error occured " + err);
	});

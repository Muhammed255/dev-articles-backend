import compression from "compression";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { appConfig } from "./config/app-config.js";
import routes from "./routes/routes.js";
import swaggerDocs from "./config/swagger.js";
import {
	errorLogger,
	httpLogger,
	logger,
	setupMongooseLogging,
} from "./config/logger.js";
const app = express();

app.use(compression());

// Set Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(httpLogger);

// Mongoose Connection to Database
mongoose.Promise = global.Promise;

mongoose
	.connect(appConfig.DATABASE_URL, {})
	.then(() => logger.info("Connected to MongoDB"))
	.catch((err) => logger.error("Error connecting to MongoDB", err));
setupMongooseLogging();

//Setup CORS
app.use(cors({ origin: "*" }));

routes(app);
app.use(errorLogger);

swaggerDocs(app);

export default app;

import compression from "compression";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { appConfig } from "./config/app-config.js";
import routes from "./routes/routes.js";
import { setupSwagger } from "./config/swagger.js";
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

//Setup CORS
app.use(cors({ origin: "*" }));

// Mongoose Connection to Database
mongoose.Promise = global.Promise;

mongoose
	.connect(appConfig.DATABASE_URL, {})
	.then(() => logger.info("Connected to MongoDB"))
	.catch((err) => logger.error("Error connecting to MongoDB", err));
setupMongooseLogging();

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

routes(app);
app.use(errorLogger);

setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
    status: 404
  });
});


export default app;

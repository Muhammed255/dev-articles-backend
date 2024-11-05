import winston from "winston";
import expressWinston from "express-winston";
import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

const apiLogFormat = winston.format((info) => {
	if (info.meta && info.meta.req) {
		const { meta } = info;
		const { req, res, responseTime } = meta;
		const status = res.statusCode;
		const statusColor =
			status >= 400 ? chalk.red : status >= 300 ? chalk.yellow : chalk.green;

		info.message = `${chalk.blue(req.method)} ${chalk.cyan(req.originalUrl)} ${statusColor(status)} ${chalk.yellow(responseTime + "ms")} ${chalk.magenta("Query:")} ${JSON.stringify(req.query)} ${chalk.magenta("Response Time:")} ${responseTime}ms`.trim();

		delete info.meta;
	}
	return info;
});
// ${chalk.magenta("Headers:")} ${JSON.stringify(req.headers)}

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		apiLogFormat(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${chalk.gray(timestamp)} ${level}: ${message}`;
		})
	),
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

// Add console transport if not in production
if (process.env.NODE_ENV !== "production") {
	logger.add(new winston.transports.Console());
}

// Middleware to log HTTP requests
const httpLogger = expressWinston.logger({
	winstonInstance: logger,
	meta: true,
	msg: "HTTP {{req.method}} {{req.url}}",
	expressFormat: true,
	colorize: false,
});

// Error logging middleware
const errorLogger = expressWinston.errorLogger({
	winstonInstance: logger,
});

// Mongoose query logging
const setupMongooseLogging = () => {
	mongoose.set("debug", (collectionName, method, query, doc) => {
		logger.info(`Mongoose: ${collectionName}.${method}`, {
			query,
			doc,
		});
	});
};

export { logger, httpLogger, errorLogger, setupMongooseLogging };

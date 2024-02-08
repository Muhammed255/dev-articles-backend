import "dotenv/config";

const {
	JWT_SECRET,
	DB_URL,
	CLOUDINARY_API_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	BACKEND_URL,
} = process.env;

export const appConfig = {
	JWT_SECRET: JWT_SECRET,
	DATABASE_URL: DB_URL,
	BACKEND_URL: BACKEND_URL,
	CLOUDINARY_CLOUD_API_NAME: CLOUDINARY_API_NAME,
	CLOUDINARY_CLOUD_API_KEY: CLOUDINARY_API_KEY,
	CLOUDINARY_CLOUD_API_SECRET: CLOUDINARY_API_SECRET,
};

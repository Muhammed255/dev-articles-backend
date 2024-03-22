import { DataSource, DataSourceOptions } from "typeorm";
import { Category } from "../entities/category.entity";
import { User } from "../entities/user.entity";
import { ArticlePost } from "./../entities/article-post.entity";
import { Comment } from "./../entities/comment.entity";
import { Reply } from "./../entities/reply.entity";
import { Topic } from "./../entities/topic.entity";
import { UserLikedPosts } from "./../entities/user-liked-posts.entity";

import "dotenv/config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

const config: DataSourceOptions = {
	type: "postgres",
	host: DB_HOST,
	port: parseInt(DB_PORT),
	username: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
	migrations: [__dirname + "/../migrations/*{.ts,.js}"],
	migrationsRun: true,
	migrationsTableName: "migrations",
	synchronize: false,
	logger: "advanced-console",
	logging: true,
	ssl: NODE_ENV === 'production' ? {requestCert: false, rejectUnauthorized: false} : false,
};

export const dataSource = new DataSource(config);
// user repo
export const UserRepository = dataSource.getRepository(User);
// category repo
export const CategoryRepository = dataSource.getRepository(Category);
// topic repo
export const TopicRepository = dataSource.getRepository(Topic);
// article repo
export const ArticlePostRepository = dataSource.getRepository(ArticlePost);
// comment repo
export const CommentRepository = dataSource.getRepository(Comment);
// reply repo
export const ReplyRepository = dataSource.getRepository(Reply);
// user-liked-posts repo
export const UserLikedPostsRepository =
	dataSource.getRepository(UserLikedPosts);

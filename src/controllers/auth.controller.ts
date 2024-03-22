import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config";
// import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import {
	ArticlePostRepository,
	CategoryRepository,
	CommentRepository,
	ReplyRepository,
	TopicRepository,
	UserLikedPostsRepository,
	UserRepository,
} from "../config/ormconfig";
import { RelationType } from "../enum/relation-type.enum";
import { UserRole } from "../enum/user-role.enum";
import {
	BadGatewayException,
	NotFoundException,
} from "../exceptions/http-exception";

export class AuthController {
	private static authInstance: AuthController;

	constructor() {
		if (AuthController.authInstance) {
			throw new Error("Use Singleton.instance");
		}
		AuthController.authInstance = this;
	}

	public static get getAuth() {
		return (
			AuthController.authInstance ??
			(AuthController.authInstance = new AuthController())
		);
	}

	async signup(req: Request, res: Response, next: NextFunction) {
		let response = { success: false, msg: "", result: null };
		try {
			const { name, email, username, password, bio } = req.body;
			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(password, salt);

			const foundUser = await UserRepository.findOneBy({ email });
			if (foundUser) {
				return res
					.status(400)
					.json({ success: false, msg: `User already exists!` });
			}

			const newUser = await UserRepository.save({
				name,
				email,
				username,
				password: hash,
				bio,
			});

			response.success = true;
			response.msg = "account created!";
			response.result = newUser;
			return res.status(200).json(response);
		} catch (err) {
			console.log(err);
			response.msg = "Error Occured" + err;
			response.result = null;
			response.success = false;
			return res.status(500).json(response);
		}
	}

	async admin_signup(req: Request, res: Response, next: NextFunction) {
		let response = { success: false, msg: "", result: null };
		try {
			const { name, email, username, password, bio } = req.body;
			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(password, salt);

			const foundUser = await UserRepository.findOneBy({ email });
			if (foundUser) {
				return res
					.status(400)
					.json({ success: false, msg: `User already exists!` });
			}

			const newUser = await UserRepository.save({
				name,
				email,
				username,
				password: hash,
				bio,
				role: UserRole.ADMIN,
			});

			response.msg = "account created!";
			response.success = true;
			response.result = newUser;
			return res.status(200).json(response);
		} catch (err) {
			response.msg = "Error Occured" + err;
			response.result = null;
			response.success = false;
			return res.status(500).json(response);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		let response = {
			success: false,
			msg: "",
			role: "",
			token: null,
			userId: null,
			user: null,
			expiresIn: 0,
		};
		try {
			const { email, password } = req.body;

			const user = await UserRepository.findOneBy({ email });
			if (!user) {
				response.msg = "Auth failed .... Email is not registered";
				return res.status(401).json(response);
			}

			const compare = await bcrypt.compare(password, user.password);
			if (!compare) {
				response.msg = "Auth failed ... Password is incorrect";
				return res.status(401).json(response);
			}
			const token = jwt.sign(
				{
					email: user?.email,
					userId: user?.id,
				},
				appConfig.JWT_SECRET,
				{ expiresIn: "1d" }
			);
			user.accessToken = token;
			await UserRepository.save(user);
			response.success = true;
			response.token = token;
			response.role = user.role;
			response.userId = user.id;
			response.user = user;
			response.expiresIn = 86400;
			response.msg = "LoggedIn successfully";
			res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.token = null;
			response.userId = null;
			response.user = null;
			response.expiresIn = 0;
			const error = new Error(err);
			response.msg = "Auth failed..." + error;
			return res.status(500).json(response);
		}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		const users = await UserRepository.find({});
		return res.status(200).json({ data: users });
	}

	async findUserById(req: Request, res: Response, next: NextFunction) {
		let response = { success: false, msg: "", user: null };
		try {
			const user = await AuthController.authInstance.findOneUser(+req.params.userId)
			response.msg = "fetched...";
			response.success = true;
			response.user = user;
			return res.status(200).json(response);
		} catch (e) {
			const err = new Error(e);
			response.msg = "Error Occurred..." + err;
			response.success = false;
			response.user = null;
			return res.status(200).json(response);
		}
	}

	async findOneUser(userId: number) {
		try {
			const user = await UserRepository.findOne({
				where: { id: userId },
				relations: [
					"articles",
					"followers",
					"articles.topic",
					"comments",
					"comments.commentator",
					"comments.article",
					"comments.replies",
					"comments.replies.replier",
					"replies",
					"userLikedPosts",
					"userLikedPosts.user",
					"userLikedPosts.article",
					"userLikedPosts.article.user",
					"articles.user",
					"articles.userLikedPosts",
					"articles.userLikedPosts.user",
					"articles.comments",
					"articles.comments.commentator",
					"articles.comments.replies",
					"articles.comments.replies.replier",
				],
			});
			if (!user) {
				throw new NotFoundException("No user found!");
			}
			return user;
		} catch (e) {
			const err = new Error(e);
			throw new BadGatewayException(err.message);
		}
	}

	async findUserByUsername(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await UserRepository.findOne({
				where: { username: req.params.username },
				relations: [
					"articles",
					"followers",
					"articles.topic",
					"comments",
					"comments.commentator",
					"comments.article",
					"comments.replies",
					"comments.replies.replier",
					"replies",
					"userLikedPosts",
					"userLikedPosts.user",
					"userLikedPosts.article",
					"userLikedPosts.article.user",
					"articles.user",
					"articles.userLikedPosts",
					"articles.userLikedPosts.user",
					"articles.comments",
					"articles.comments.commentator",
					"articles.comments.replies",
					"articles.comments.replies.replier",
				],
			});
			if (!user) {
				return res
					.status(401)
					.json({ success: false, msg: "No user found", user: null });
			}
			return res.status(200).json({ success: true, msg: "Fetched", user });
		} catch (e) {
			const err = new Error(e);
			return res
				.status(200)
				.json({ success: false, msg: "Error Occurred..." + err, user: null });
		}
	}

	async getAuthProfle(req: Request, res: Response, next: NextFunction) {
		let response = { success: false, msg: "", user: null };
		try {
			const user = await UserRepository.findOneBy({
				id: Number((req as any).userData.userId),
			});
			if (!user) {
				response.msg = "No user found";
				return res.status(401).json(response);
			}
			response.msg = "fetched...";
			response.success = true;
			response.user = user;
			return res.status(200).json(response);
		} catch (err) {
			const error = new Error(err);
			response.msg = "Error Occurred..." + error;
			response.success = false;
			response.user = null;
			return res.status(200).json(response);
		}
	}

	async getDashboard(req, res, next) {
		try {
			const authAdmin = await UserRepository.findOne({
				where: { id: +req.userData.userId, role: UserRole.ADMIN },
			});
			if (!authAdmin) {
				return res.status(404).json({ success: false, msg: "No Admin found!" });
			}
			const categoriesCount = await CategoryRepository.count();
			const topicsCount = await TopicRepository.count();
			const articlesCount = await ArticlePostRepository.count();
			const commentsCount = await CommentRepository.count();
			const repliesCount = await ReplyRepository.count();
			const likesCount = await UserLikedPostsRepository.count({
				where: { type: RelationType.LIKE },
			});
			const dislikesCount = await UserLikedPostsRepository.count({
				where: { type: RelationType.DISLIKE },
			});

			return res.status(200).json({
				success: true,
				msg: "Fetched!",
				data: {
					categoriesCount,
					topicsCount,
					articlesCount,
					commentsCount,
					repliesCount,
					likesCount,
					dislikesCount,
				},
			});
		} catch (err) {
			return res
				.status(200)
				.json({ success: false, msg: "Error occured!" + err });
		}
	}

	/*async updateImage(req: Request, res: Response, next: NextFunction) {
    let response = { success: false, msg: "" };
    const url = req.protocol + "://" + req.get("host");
    try {
      const authUser = await User.findById(req.userData.userId);
      if (!authUser._id) {
        response.msg = "No user found";
        return res.status(401).json(response);
      }

      let imagePath = req.body.image;
      if (req.file) {
        fileHelper.deleteFile(authUser.imageUrl);
        imagePath = url + "/images/users/" + req.file.filename;
      }

      await User.findOneAndUpdate(
        { _id: authUser._id },
        { imageUrl: imagePath },
        { new: true }
      );
      response.success = true;
      response.msg = "Image updated successfully";
      return res.status(200).json(response);
    } catch (err) {
        response.success = false;
        response.msg = "Error Occurred!";
        const error = new Error();
        error.msg = err;
        next(error);
        return res.status(500).json(response);
    }
  },*/
}

import { NextFunction } from "express";
import {
	CategoryRepository,
	TopicRepository,
	UserRepository,
} from "../config/ormconfig";
import { UserRole } from "../enum/user-role.enum";

export class CategoryController {
	private static categoryInstance: CategoryController;

	constructor() {}

	static getCategory(): CategoryController {
		if (!this.categoryInstance) {
			CategoryController.categoryInstance = new CategoryController();
		}
		return CategoryController.categoryInstance;
	}

	async create_category(req, res, next) {
		const { name, description } = req.body;
		let response = { success: false, msg: "" };
		try {
			const user = await UserRepository.findOneBy({ id: req.userData.userId });
			if (!user) {
				response.msg = "No user found..";
				return res.status(401).send(response);
			}
			if (user.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			await CategoryRepository.save({
				name,
				description,
				user: user,
			});

			response.success = true;
			response.msg = "Created category....";
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.msg = "Error Occurred: " + err;
			return res.status(500).json({ response });
		}
	}

	async findCategoryById(req, res, next: NextFunction) {
		let response = { success: false, msg: "", category: null };
		try {
			const cat = await CategoryRepository.findOneBy({ id: +req.params.catId });
			if (!cat) {
				response.msg = "Error: No Category found";
				return res.status(401).json(response);
			}
			response.success = true;
			response.msg = "Category fetched....";
			response.category = cat;
			return res.status(200).json(response);
		} catch (err) {
			console.log(err);
			response.success = false;
			response.category = null;
			const error = new Error(err);
			response.msg = "Error Occurred...." + error;
			return res.status(500).json({ response });
		}
	}

	async findAllCategories(req, res, next) {
		let response = { success: false, msg: "", categories: null, maxCats: 0 };
		try {
			const [cats, count] = await CategoryRepository.findAndCount({
				relations: ["user", "topics"],
			});
			response.success = true;
			response.msg = "Categories fetched successfully!";
			response.categories = cats;
			response.maxCats = count;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.categories = null;
			response.maxCats = 0;
			const error = new Error(err);
			response.msg = "Error Occurred!" + error;
			return res.status(500).json(response);
		}
	}
	async findAdminCategories(req, res, next) {
		let response = { success: false, msg: "", categories: null, maxCats: 0 };
		const skip = +req.query.skip || 0;
		const take = +req.query.take || 10;
		try {
			const authUser = await UserRepository.findOneBy({
				id: req.userData.userId,
				role: UserRole.ADMIN,
			});

			if(!authUser) {
				return res.status(404).json({success: false, msg: "No user found!"})
			}

			if (authUser.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}
			let catsQuery = CategoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.user", "user");
			// catsQuery.where(`category.userId=${authUser.id}`);
			const [count, fetchedCats] = await Promise.all([
				catsQuery.getCount(),
				catsQuery
						.skip(skip)
						.take(take)
						.getMany()
		]);
			response.success = true;
			response.msg = "Categories fetched successfully!";
			response.categories = fetchedCats;
			response.maxCats = count;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.categories = null;
			response.maxCats = 0;
			const error = new Error(err);
			response.msg = "Error Occurred!" + error;
			return res.status(500).json(response);
		}
	}

	async updateCategory(req, res, next) {
		let response = { success: false, msg: "", category: null };
		const { name, description } = req.body;
		try {
			const cat = await CategoryRepository.findOne({
				where: { id: +req.params.catId },
				relations: ["user"],
			});

			if (!cat) {
				return res
					.status(401)
					.send({ success: false, msg: "No category found!" });
			}

			const authUser = await UserRepository.findOneBy({
				id: +req.userData.userId,
			});

			if (!authUser) {
				return res.status(401).send({ success: false, msg: "No user found!" });
			}
			if (authUser.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if (cat.user.id != authUser.id) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}
			await CategoryRepository.update(
				{ id: req.params.catId },
				{ name, description }
			);
			response.success = true;
			response.msg = "Category updated successfully";
			return res.status(200).json(response);
		} catch (e) {
			response.success = false;
			response.category = null;
			const error = new Error();
			response.msg = "Error Occurred!" + error;
			return res.status(500).json(response);
		}
	}

	async removeCategory(req, res, next) {
		let response = { success: false, msg: ""};
		try {
			const catToDelete = await CategoryRepository.findOne({
				where: { id: req.params.catId },
				relations: ["user"],
			});

			const authUser = await UserRepository.findOneBy({
				id: req.userData.userId,
			});
			if (authUser.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if (catToDelete.user.id != req.userData.userId) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			const cat = await CategoryRepository.delete({ id: req.params.catId });
			response.success = true;
			response.msg = "Category removed successfully";
			res.status(200).json(response);
		} catch (err) {
			response.success = false;
			const error = new Error(err);
			response.msg = "Error Occurred!" + error;
			return res.status(500).json(response);
		}
	}

	async getTopicsByCategory(req, res, next) {
		let response = { success: false, msg: "", topicsByCat: null };
		try {
			const result = await TopicRepository.manager.query(`
			SELECT * FROM topics t INNER JOIN categories c ON t."categoryId"=c.id
			`);

			const docs = await CategoryRepository.createQueryBuilder("cat")
				.innerJoinAndSelect("cat.topics", "topics")
				.getMany();

			response.success = true;
			response.msg = "Fetched....";
			response.topicsByCat = docs;
			return res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.topicsByCat = null;
			const error = new Error(err);
			response.msg = "Error Occurred...." + error;
			return res.status(500).json(response);
		}
	}
}

import { In, Not } from "typeorm";
import {
	CategoryRepository,
	TopicRepository,
	UserRepository,
} from "../config/ormconfig";
import {
	BadGatewayException,
	NotFoundException,
} from "../exceptions/http-exception";
import { destroyImage, uploadImage } from "../helper/upload-destroy.helper";

export class TopicController {
	private static topicInstance: TopicController;

	constructor() {}

	static getTopic(): TopicController {
		if (!this.topicInstance) {
			TopicController.topicInstance = new TopicController();
		}
		return TopicController.topicInstance;
	}

	async create_topic(req, res, next) {
		try {
			const { name, description, categoryId } = req.body;
			const user = await UserRepository.findOneBy({ id: req.userData.userId });
			if (user.role !== "admin") {
				return res.status(401).send({ success: false, msg: "Unauthorized.." });
			}

			const fetchedCategory = await CategoryRepository.findOneBy({
				id: +categoryId,
			});

			if (!fetchedCategory) {
				return res
					.status(404)
					.json({ success: false, msg: "No category found!" });
			}

			const imageResult = await uploadImage(
				req.file.path,
				"dev-articles/topics"
			);

			await TopicRepository.save({
				name,
				description,
				category: fetchedCategory,
				user: user,
				cloudinary_id: imageResult.public_id,
				image: imageResult.secure_url,
			});
			res.status(200).json({ success: true, msg: "Topic created...." });
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ success: false, msg: "Error occured! " + err });
		}
	}

	async findTopicById(req, res, next) {
		let response = { success: false, msg: "", topic: null };
		try {
			const topic = await TopicRepository.findOne({
				where: { id: +req.params.topicId },
				relations: ["category"],
			});

			if (!topic) {
				response.msg = "Error: No Topic found";
				return res.status(404).json(response);
			}
			response.success = true;
			response.msg = "Topic fetched....";
			response.topic = topic;
			res.status(200).json(response);
		} catch (err) {
			response.success = false;
			response.topic = null;
			const error = new Error();
			error.message = err;
			response.msg = "Error Occurred...." + error;
			res.status(500).json(response);
		}
	}

	async findOneTopic(topicId: number) {
		try {
			const topic = await TopicRepository.findOne({
				where: { id: topicId },
				relations: ["category"],
			});

			if (!topic) {
				throw new NotFoundException("No topic found");
			}
			return topic;
		} catch (err) {
			const error = new Error();
			error.message = err;
			throw new BadGatewayException(error.message);
		}
	}

	async getAllTopics(req, res, next) {
		try {
			const topics = await TopicRepository.find({ relations: ["user"] });
			return res.status(200).json({ success: true, msg: "Fetched", topics });
		} catch (err) {
			return res.status(500).json({ success: false, msg: "Error" + err });
		}
	}

	async getOtherTopics(req, res, next) {
		try {
			const currentTopicId = +req.params.topicId;
			const topics = await TopicRepository.find({
				where: { id: Not(In([currentTopicId])) },
				relations: ["user"],
			});
			return res.status(200).json({ success: true, msg: "Fetched", topics });
		} catch (err) {
			return res.status(500).json({ success: false, msg: "Error" + err });
		}
	}

	async findAllTopics(req, res, next) {
		let response = { success: false, msg: "", topics: null, maxTopics: 0 };
		const skip = +req.query.skip || 0;
		const take = +req.query.take || 10;
		try {
			let topicsQuery = TopicRepository.createQueryBuilder("topic")
				.where(`topic.user=${+req.userData.userId}`)
				.leftJoinAndSelect("topic.category", "category");

			const [count, fetchedTopics] = await Promise.all([
				topicsQuery.getCount(),
				topicsQuery.skip(skip).take(take).getMany(),
			]);
			response.success = true;
			response.msg = "Topics fetched successfully!";
			response.topics = fetchedTopics;
			response.maxTopics = count;
			return res.status(200).json(response);
		} catch (err) {
			console.log(err);
			response.success = false;
			response.topics = null;
			response.maxTopics = 0;
			const error = new Error();
			error.message = err;
			response.msg = "Error Occurred!" + error;
			res.status(500).json(response);
		}
	}

	async updateTopic(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const { name, description, categoryId } = req.body;
			const topic = await TopicRepository.findOne({
				where: { id: +req.params.topicId },
				relations: ["user"],
			});
			if (!topic) {
				return res
					.status(404)
					.json({ success: false, msg: "Topic not found!" });
			}

			const authUser = await UserRepository.findOneBy({
				id: +req.userData.userId,
			});
			if (authUser.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if (topic.user.id != +req.userData.userId) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if ((topic.cloudinary_id && topic.image) || req.file) {
				if (topic.cloudinary_id && topic.image && req.file) {
					await destroyImage(topic.cloudinary_id);
					topic.cloudinary_id = "";
					topic.image = "";
				}
				if (req.file) {
					const imageResult = await uploadImage(
						req.file.path,
						"dev-articles/topics"
					);
					topic.image = imageResult.secure_url;
					topic.cloudinary_id = imageResult.public_id;
				}
			}
			await TopicRepository.save(topic);

			await TopicRepository.update(
				{ id: topic.id },
				{
					...(name && { name: name }),
					...(description && { description: description }),
					...(categoryId && {
						category: await CategoryRepository.findOneByOrFail({
							id: +categoryId,
						}),
					}),
				}
			);

			response.success = true;
			response.msg = "Topic updated successfully";
			return res.status(200).json(response);
		} catch (e) {
			console.log(e);
			response.success = false;
			const error = new Error(e);
			response.msg = "Error Occurred!" + error;
			return res.status(500).json(response);
		}
	}

	async removeTopic(req, res, next) {
		let response = { success: false, msg: "" };
		try {
			const topicToDelete = await TopicRepository.findOne({
				where: { id: +req.params.topicId },
				relations: ["user"],
			});

			const authUser = await UserRepository.findOneBy({
				id: +req.userData.userId,
			});
			if (authUser.role !== "admin") {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if (topicToDelete.user.id != authUser.id) {
				response.msg = "Unauthorized..";
				return res.status(401).send(response);
			}

			if (topicToDelete.image || topicToDelete.cloudinary_id) {
				await destroyImage(topicToDelete.cloudinary_id);
			}

			await TopicRepository.delete({
				id: topicToDelete.id,
				user: authUser,
			});

			response.success = true;
			response.msg = "Topic removed successfully";
			res.status(200).json(response);
		} catch (error) {
			response.success = false;
			const err = new Error(error);
			response.msg = "Error Occurred!" + err;
			return res.status(500).json(response);
		}
	}
}

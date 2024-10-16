import cloudinaryApi from "../config/cloudinary-api.js";
import Topic from "../models/topic.model.js";
import User from "../models/user.model.js";

export default {
  async create_topic(req, res, next) {
    let response = { success: false, msg: "" };
    try {
      const { name, description, categoryId } = req.body;
      const user = await User.findById(req.userData.userId);
      if (user.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send(response);
      }

      const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
        folder: "dev-articles/topics",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      const newTopic = new Topic({
        name,
        description,
        categoryId,
        userId: req.userData.userId,
        cloudinary_id: imageResult.public_id,
        image: imageResult.secure_url,
      });

      await newTopic.save();
      response.success = true;
      response.msg = "Topic created....";
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error(err);
      next(error);
      return res.status(500).json(response);
    }
  },

  findTopicById(req, res, next) {
    let response = { success: false, msg: "", topic: null };
    Topic.findById(req.params.topicId)
      .then((topic) => {
        if (!topic) {
          response.msg = "Error: No Topic found";
          return res.status(401).json({ response });
        }
        response.success = true;
        response.msg = "Topic fetched....";
        response.topic = topic;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred....";
        response.topic = null;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ response });
      });
  },


  async getAllTopics(req, res, next) {
    try {
      const topics = await Topic.find().populate("userId");
      return res.status(200).json({success: true, msg: "Fetched", topics});
    } catch (err) {
      return res.status(500).json({success: false, msg: "Error" + err});
    }
  },

  findAllTopics(req, res, next) {
    let response = { success: false, msg: "", topics: null, maxTopics: 0 };
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const topicsQuery = Topic.find({ userId: req.userData.userId });
    let fetchedTopics;
    if (pageSize && currentPage) {
      topicsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    topicsQuery
      .populate("categoryId")
      .then((documents) => {
        fetchedTopics = documents;
        return Topic.countDocuments();
      })
      .then((count) => {
        response.success = true;
        response.msg = "Topics fetched successfully!";
        response.topics = fetchedTopics;
        response.maxTopics = count;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred!";
        response.topics = null;
        response.maxTopics = 0;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ response });
      });
  },

  async updateTopic(req, res, next) {
    let response = { success: false, msg: "" };
    try {
      const { name, description, categoryId } = req.body;
      const topic = await Topic.findById(req.params.topicId);
      if (!topic) {
        return res
          .status(404)
          .json({ success: false, msg: "Topic not found!" });
      }

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (topic.userId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (name) {
        topic.name = name;
      }

      if (categoryId) {
        topic.categoryId = categoryId;
      }

      if (description) {
        topic.description = description;
      }
      if(req.file) {
        await cloudinaryApi.uploader.destroy(topic.cloudinary_id, {
          resource_type: "image",
          invalidate: true,
        });
      }
      if(!req.body.image) {
        const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
          folder: "dev-articles/topics",
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        });

        topic.image = imageResult.secure_url;
        topic.cloudinary_id = imageResult.public_id;
      }


      await topic.save();

      response.success = true;
      response.msg = "Topic updated successfully";
      return res.status(200).json(response);
    } catch (e) {
      console.log(JSON.stringify(e));
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error(e);
      next(error);
      return res.status(500).json(response);
    }
  },

  async removeTopic(req, res, next) {
    let response = { success: false, msg: "" };
    try {
      const topicToDelete = await Topic.findById(req.params.topicId);

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (topicToDelete.userId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (topicToDelete.image || topicToDelete.cloudinary_id) {
        await cloudinaryApi.uploader.destroy(topicToDelete.cloudinary_id, {
          invalidate: true,
          resource_type: "image",
        });
      }

      await Topic.findOneAndRemove({
        _id: req.params.topicId,
        userId: req.userData.userId,
      });

      response.success = true;
      response.msg = "Topic removed successfully";
      res.status(200).json(response);
    } catch (error) {
      response.success = false;
      response.msg = "Error Occurred!";
      const err = new Error(error);
      next(err);
      return res.status(500).json(response);
    }
  },
};

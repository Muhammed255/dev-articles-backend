import Topic from "../models/topic.model";
import User from "../models/user.model";

export default {
  create_topic(req, res, next) {
    let response = { success: false, msg: "" };
    const url = req.protocol + "://" + req.get("host");
    const { name, description, categoryId } = req.body;

    User.findById(req.userData.userId)
      .then((user) => {
        if (user.role !== "admin") {
          response.msg = "Unauthorized..";
          return res.status(401).send({ response });
        }
        const newTopic = new Topic({
          name,
          description,
          categoryId,
          userId: req.userData.userId,
          image: url + "/images/topics/" + req.file.filename,
        });
        return newTopic.save();
      })
      .then(() => {
        response.success = true;
        response.msg = "Topic created....";
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred!";
        const error = new Error();
        error.message = err;
        next(error);
        return res.status(500).json({ response });
      });
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
    const url = req.protocol + "://" + req.get("host");
    const { name, description } = req.body;
    try {
      const topic = await Topic.findById(req.params.topicId);

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (topic.userId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }
      let imagePath = req.body.image;
      if (req.file) {
        imagePath = url + "/images/topics/" + req.file.filename;
      }

      await Topic.findByIdAndUpdate(
        req.params.topicId,
        { name, description, image: imagePath },
        { new: true }
      );
      response.success = true;
      response.msg = "Topic updated successfully";
      return res.status(200).json({ response });
    } catch (e) {
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error();
      error.message = e;
      next(error);
      return res.status(500).json({ response });
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

      await Topic.findByIdAndDelete(req.params.topicId);

      response.success = true;
      response.msg = "Topic removed successfully";
      res.status(200).json({ response });
    } catch (error) {
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error();
      error.message = err;
      next(error);
      return res.status(500).json({ response });
    }
  },
};

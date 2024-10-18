import express from "express";
import multer from "multer";
import topicController from "../controllers/topic.controller.js";
import { checkAuth } from "../middleware/check-auth.js";

export const topicRoutes = express.Router();

topicRoutes.post(
  "/create",
  checkAuth,
  multer({ storage: multer.diskStorage({}) }).single("image"),
  topicController.create_topic
);

topicRoutes.get("/get-all", topicController.findAllTopics);
topicRoutes.get("/admin-topics", checkAuth, topicController.findAllTopics);
topicRoutes.get("/all-topics", topicController.getAllTopics)
topicRoutes.get("/get-other-topics/:topicId", topicController.getOtherTopics);

topicRoutes
  .route("/:topicId")
  .get(topicController.findTopicById)
  .put(
    checkAuth,
    multer({ storage: multer.diskStorage({}) }).single("image"),
    topicController.updateTopic
  )
  .delete(checkAuth, topicController.removeTopic);

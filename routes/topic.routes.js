import express from "express";
import multer from "multer";
import topicController from "../controllers/topic.controller";
import { checkAuth } from "../middleware/check-auth";

export const topicRoutes = express.Router();

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/topics");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

topicRoutes.post(
  "/create",
  checkAuth,
  multer({ storage: storage, fileFilter: fileFilter }).single("image"),
  topicController.create_topic
);

topicRoutes.get("/get-all", topicController.findAllTopics);
topicRoutes.get("/admin-topics", checkAuth, topicController.findAllTopics);

topicRoutes
  .route("/:topicId")
  .get(topicController.findTopicById)
  .put(
    checkAuth,
    multer({ storage: storage, fileFilter: fileFilter }).single("image"),
    topicController.updateTopic
  )
  .delete(checkAuth, topicController.removeTopic);

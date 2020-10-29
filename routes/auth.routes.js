import express from "express";
import multer from "multer";
import authController from "../controllers/auth.controller";
import { checkAuth } from "./../middleware/check-auth";

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
    cb(error, "backend/images/users");
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

export const authRouter = express.Router();

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

authRouter.post("/admin-signup", authController.admin_signup);

authRouter.post("/confirmation", authController.email_confirmation);

authRouter.post("/resend_confirmation", authController.resend_confirmation);

/*authRouter.post(
  "/update-auth-image",
  checkAuth,
  multer({ storage: storage, fileFilter: fileFilter }),
  authController.updateImage
);*/

authRouter.get("/:userId", checkAuth, authController.findUserById);

authRouter.get("/user/:username", checkAuth, authController.findUserByUsername);

authRouter.get("/users", checkAuth, authController.getUsers);

authRouter.get("/profile", checkAuth, authController.getAuthProfle);

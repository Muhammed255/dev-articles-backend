import express from "express";
import categoryController from "../controllers/category.controller";
import { checkAuth } from "../middleware/check-auth";

export const categoryRoutes = express.Router();

categoryRoutes.post("/new-cat", checkAuth, categoryController.create_category);

categoryRoutes.get("/get-all", categoryController.findAllCategories);

categoryRoutes.get("/admin-categories", checkAuth, categoryController.findAdminCategories);

categoryRoutes.get("/join", categoryController.getTopicsByCategory);

categoryRoutes
  .route("/:catId")
  .get(categoryController.findCategoryById)
  .put(checkAuth, categoryController.updateCategory)
  .delete(checkAuth, categoryController.removeCategory);

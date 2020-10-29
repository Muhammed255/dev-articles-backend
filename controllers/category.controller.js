import Category from "../models/category.model";
import User from "../models/user.model";

export default {
  create_category(req, res, next) {
    const { name, description } = req.body;
    let response = { success: false, msg: "" };
    User.findById(req.userData.userId)
      .then((user) => {
        if (user.role !== "admin") {
          response.msg = "Unauthorized..";
          return res.status(401).send({ response });
        }
        const newCat = new Category({
          name,
          description,
          userId: req.userData.userId,
        });
        return newCat.save();
      })
      .then(() => {
        response.success = true;
        response.msg = "Created category....";
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred: " + err;
        res.status(500).json({ response });
      });
  },

  findCategoryById(req, res, next) {
    let response = { success: false, msg: "", category: null };
    Category.findById(req.params.catId)
      .then((cat) => {
        if (!cat) {
          response.msg = "Error: No Category found";
          return res.status(401).json({ response });
        }
        response.success = true;
        response.msg = "Category fetched....";
        response.category = cat;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred....";
        response.category = null;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ response });
      });
  },

  findAllCategories(req, res, next) {
    let response = { success: false, msg: "", categories: null, maxCats: 0 };
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const catsQuery = Category.find();
    let fetchedCats;
    if (pageSize && currentPage) {
      catsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    catsQuery
      .then((documents) => {
        fetchedCats = documents;
        return Category.countDocuments();
      })
      .then((count) => {
        response.success = true;
        response.msg = "Categories fetched successfully!";
        response.categories = fetchedCats;
        response.maxCats = count;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred!";
        response.categories = null;
        response.maxCats = 0;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ response });
      });
  },
  findAdminCategories(req, res, next) {
    let response = { success: false, msg: "", categories: null, maxCats: 0 };
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const catsQuery = Category.find({userId: req.userData.userId});
    let fetchedCats;
    if (pageSize && currentPage) {
      catsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    catsQuery
      .then((documents) => {
        fetchedCats = documents;
        return Category.countDocuments();
      })
      .then((count) => {
        response.success = true;
        response.msg = "Categories fetched successfully!";
        response.categories = fetchedCats;
        response.maxCats = count;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred!";
        response.categories = null;
        response.maxCats = 0;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ response });
      });
  },

  async updateCategory(req, res, next) {
    let response = { success: false, msg: "", category: null };
    const { name, description } = req.body;
    try {
      const cat = await Category.findById(req.params.catId);

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (cat.userId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }
      const catToUpdate = await Category.findByIdAndUpdate(
        req.params.catId,
        { name, description },
        { new: true }
      );
      response.success = true;
      response.msg = "Category updated successfully";
      response.category = catToUpdate;
      return res.status(200).json({ response });
    } catch (e) {
      response.success = false;
      response.msg = "Error Occurred!";
      response.category = null;
      const error = new Error();
      error.message = e;
      next(error);
      return res.status(500).json({ response });
    }
  },

  async removeCategory(req, res, next) {
    let response = { success: false, msg: "", category: null };
    try {
      const catToDelete = await Category.findById(req.params.catId);

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (catToDelete.userId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      const cat = await Category.findByIdAndDelete(req.params.catId);
      response.success = true;
      response.msg = "Category removed successfully";
      response.category = cat;
      res.status(200).json({ response });
    } catch (err) {
      response.success = false;
      response.msg = "Error Occurred!";
      response.category = null;
      const error = new Error();
      error.message = err;
      next(error);
      return res.status(500).json({ response });
    }
  },

  getTopicsByCategory(req, res, next) {
    let response = { success: false, msg: "", topicsByCat: null };
    Category.aggregate([
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "categoryId",
          as: "TopicsCategories",
        },
      },
    ])
      .then((result) => {
        response.success = true;
        response.msg = "Fetched....";
        response.topicsByCat = result;
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred....";
        response.topicsByCat = null;
        const error = new Error(err);
        next(error);
        res.status(500).json({ response });
      });
  },
};

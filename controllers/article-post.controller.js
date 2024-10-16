import mongoose from "mongoose";
const { isValidObjectId } = mongoose;
import cloudinaryApi from "../config/cloudinary-api.js";
import ArticlePost from "../models/article-post.model.js";
import Topic from "../models/topic.model.js";
import User from "../models/user.model.js";

export default {
  async add_post(req, res, next) {
    let response = { success: false, msg: "", article: null };
    try {
      const { title, sub_title, content, topicId } = req.body;
      const user = await User.findById(req.userData.userId);
      if (user.role !== "admin") {
        response.msg = "No Allowed to create article, Only Admins can create";
        return res.status(401).json({ ...response });
      }

      const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
        folder: "dev-articles/articles",
      });

      const newPost = new ArticlePost({
        title,
        sub_title,
        content,
        cloudinary_id: imageResult.public_id,
        article_image: imageResult.secure_url,
        topicId,
        autherId: req.userData.userId,
      });
      const post = await newPost.save();

      response.msg = "Article created..";
      response.success = true;
      response.article = post;
      res.status(200).json({ ...response });
    } catch (err) {
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error();
      error.message = err;
      next(error);
      return res.status(500).json({ ...response });
    }
  },

  getArticles(req, res, next) {
    let response = { success: false, msg: "", articles: null, maxArticles: 0 };
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const articleQuery = ArticlePost.find();
    let fetchedArticles;
    if (pageSize && currentPage) {
      articleQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    articleQuery
      .populate("autherId")
      .populate("likedBy")
      .populate("dislikedBy")
      .then((documents) => {
        fetchedArticles = documents;
        return ArticlePost.countDocuments();
      })
      .then((count) => {
        response.success = true;
        response.msg = "Articles fetched successfully!";
        response.articles = fetchedArticles;
        response.maxArticles = count;
        res.status(200).json({ ...response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred!";
        response.articles = null;
        response.maxArticles = 0;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ ...response });
      });
  },

  findArticle(req, res, next) {
    let response = { success: false, msg: "", article: null };
    ArticlePost.findById(req.params.postId)
      .populate("autherId")
      .populate("topicId")
      .populate("comments.commentator")
      .populate("comments.replies.replier")
      .then((article) => {
        if (!article) {
          response.msg = "Error: No article found";
          return res.status(401).json({ ...response });
        }

        response.success = true;
        response.msg = "Article fetched....";
        response.article = article;
        res.status(200).json({ ...response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred....";
        response.article = null;
        const error = new Error();
        error.message = err;
        next(error);
        res.status(500).json({ ...response });
      });
  },

  async updateArticle(req, res, next) {
    let response = { success: false, msg: "", newArticle: null };
    try {
      const { title, sub_title, content, topicId } = req.body;

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      const article = await ArticlePost.findById(req.params.postId);
      if (!article) {
        return res
          .status(404)
          .json({ success: false, msg: "No Article found!" });
      }

      if (article.autherId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (title) {
        article.title = title;
      }

      if (sub_title) {
        article.sub_title = sub_title;
      }

      if (content) {
        article.content = content;
      }

      if (topicId) {
        isValidObjectId(topicId) ? (article.topicId = topicId) : "Not objectId";
      }

      if (req.file) {
        await cloudinaryApi.uploader.destroy(article.cloudinary_id, {
          resource_type: "image",
          invalidate: true,
        });
      }
      if (!req.body.article_image) {
        const imageResult = await cloudinaryApi.uploader.upload(req.file.path, {
          folder: "dev-articles/articles",
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        });

        article.article_image = imageResult.secure_url;
        article.cloudinary_id = imageResult.public_id;
      }

      const newArticle = await article.save();

      response.success = true;
      response.msg = "Article updated successfully";
      response.newArticle = newArticle;

      res.status(200).json({ ...response });
    } catch (e) {
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error(e);
      next(error);
      return res.status(500).json({ ...response });
    }
  },

  async deleteArticle(req, res, next) {
    let response = { success: false, msg: "" };
    try {
      const article = await ArticlePost.findById(req.params.postId);

      const authUser = await User.findById(req.userData.userId);
      if (authUser.role !== "admin") {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      if (article.autherId.toString() !== req.userData.userId.toString()) {
        response.msg = "Unauthorized..";
        return res.status(401).send({ response });
      }

      await cloudinaryApi.uploader.destroy(article.cloudinary_id, {
        resource_type: "image",
        invalidate: true,
      });

      await ArticlePost.findByIdAndDelete(req.params.postId);
      response.success = true;
      response.msg = "Article removed successfully";
      res.status(200).json({ ...response });
    } catch (err) {
      response.success = false;
      response.msg = "Error Occurred!";
      const error = new Error(err);
      next(error);
      return res.status(500).json({ ...response });
    }
  },

  async getArticlesByTopic(req, res, _next) {
    try {
      if (!isValidObjectId(req.params.topicId)) {
        return res
          .status(402)
          .json({ success: false, msg: "Not valid objectId" });
      }
      const topic = await Topic.findById(req.params.topicId);
      if (!topic) {
        return res
          .status(404)
          .json({ success: false, msg: "No Topic found!!" });
      }
      const fetchedArtices = await ArticlePost.find({
        topicId: topic._id,
      }).populate("autherId");
      return res
        .status(200)
        .json({
          success: true,
          msg: "Fetched!",
          articles: fetchedArtices,
          topic: topic,
        });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: "Error Occured!" + err.message });
    }
  },

  async articles_search(req, res, _next) {
    try {
      const { searchString } = req.body;
      const docs = await ArticlePost.find({
        $or: [
          { title: { $regex: searchString, $options: "i" } },
          { sub_title: { $regex: searchString, $options: "i" } },
          { content: { $regex: searchString, $options: "i" } },
        ],
      })
      if (!docs) {
        return res
          .status(401)
          .json({ success: false, msg: "Could not fetch!" });
      }
      return res
        .status(200)
        .json({ success: true, msg: "fetched", articles: docs });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Error occured: " + err.message });
    }
  },

  articleComment(req, res, _next) {
    let response = { success: false, msg: "" };
    // Check if comment was provided in request body
    if (!req.body.comment) {
      response.msg = "No comment provided";
      res.json({ ...response }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        response.msg = "No id was provided";
        res.json({ ...response }); // Return error message
      } else {
        // Use id to search for article post in database
        ArticlePost.findOne({ _id: req.body.id }, (err, article) => {
          // Check if error was found
          if (err) {
            response.msg = "Invalid article id";
            res.json({ ...response }); // Return error message
          } else {
            // Check if id matched the id of any article in the database
            if (!article) {
              response.msg = "article not found.";
              res.json({ ...response }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ _id: req.userData.userId }, (err, user) => {
                // Check if error was found
                if (err) {
                  response.msg = "Something went wrong";
                  res.json({ ...response }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    response.msg = "User not found.";
                    res.json({ ...response }); // Return error message
                  } else {
                    // Add the new comment to the article comments array
                    // @ts-ignore
                    article.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: user._id, // Person who commented
                    });
                    // Save article post
                    article.save((err) => {
                      // Check if error was found
                      if (err) {
                        response.msg = "Something went wrong.";
                        res.json({ ...response }); // Return error message
                      } else {
                        response.success = true;
                        response.msg = "Comment added";
                        res.json({ ...response }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  },

  articleCommentReply(req, res, _next) {
    const replyData = {
      "comments.$.replies": {
        reply: req.body.reply,
        replier: req.userData.userId,
      },
    };

    ArticlePost.findOneAndUpdate(
      { _id: req.body.postId, "comments._id": req.body.commentId },
      {
        $addToSet: replyData,
      },
      { new: true, upsert: true }
    )
      .then((article) => {
        res.status(200).json({ article: article });
      })
      .catch((error) => {
        res.status(500).json({ err: "error: " + error });
      });
  },

  addArticleToBookmark(req, res, next) {
    let response = { success: false, msg: "" };
    let fetchedUser;
    User.findOne({ _id: req.userData.userId })
      .then((user) => {
        if (!user) {
          response.msg = "No user found..";
          res.status(400).json({ ...response });
        }
        fetchedUser = user;
        return ArticlePost.findById(req.params.postId);
      })
      .then((post) => {
        if (!post) {
          response.msg = "No post found..";
          res.status(400).json({ ...response });
        }
        fetchedUser.bookmarks.push(post._id);
        return fetchedUser.save();
      })
      .then(() => {
        response.success = true;
        response.msg = "Bookmarked...";
        res.status(201).json({ ...response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred..";
        const error = new Error(err);
        next(error);
        return res.status(500).json({ ...response });
      });
  },

  removeArticleFromBookmarks(req, res, next) {
    let response = { success: false, msg: "" };
    let fetchedUser;
    User.findOne({ _id: req.userData.userId })
      .then((user) => {
        if (!user) {
          response.msg = "No user found..";
          res.status(400).json({ ...response });
        }
        fetchedUser = user;
        return ArticlePost.findById(req.params.postId);
      })
      .then((post) => {
        if (!post) {
          response.msg = "No post found..";
          res.status(400).json({ ...response });
        }
        const postIndex = fetchedUser.bookmarks.findIndex((id) => {
          return id.toString() === post._id;
        });
        if (postIndex !== -1) {
          fetchedUser.bookmarks.splice(postIndex, 1);
        }
        fetchedUser.bookmarks.pull(post._id);
        return fetchedUser.save();
      })
      .then(() => {
        response.success = true;
        response.msg = "Removed from bookmarks...";
        res.status(201).json({ ...response });
      })
      .catch((err) => {
        response.success = false;
        response.msg = "Error Occurred..";
        const error = new Error(err);
        next(error);
        return res.status(500).json({ ...response });
      });
  },

  likeArticle(req, res, _next) {
    let response = { success: false, msg: "" };
    if (!req.body.id) {
      response.msg = "No id was provided.";
      res.status(402).json({ ...response });
    } else {
      ArticlePost.findOne({ _id: req.body.id }, (err, article) => {
        if (err) {
          response.msg = "Invalid article id";
          res.status(402).json({ ...response });
        } else {
          if (!article) {
            response.msg = "That article was not found.";
            res.status(404).json({ ...response });
          } else {
            User.findOne({ _id: req.userData.userId }, (err, user) => {
              if (err) {
                response.msg = "Something went wrong.";
                res.status(500).json({ ...response });
              } else {
                if (!user) {
                  response.msg = "You are not authorized to like this article";
                  res.status(402).json({ ...response });
                } else {
                  if (user._id === article.autherId) {
                    response.msg = "Cannot like your own post.";
                    res.status(500).json({ ...response });
                  } else {
                    if (article.likedBy.includes(user._id)) {
                      response.msg = "You already liked this post.";
                      res.status(500).json({ ...response }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (article.dislikedBy.includes(user._id)) {
                        article.dislikes--;
                        const arrayIndex = article.dislikedBy.indexOf(user._id);
                        article.dislikedBy.splice(arrayIndex, 1);
                        article.likes++;
                        article.likedBy.push(user._id);

                        article.save((err) => {
                          if (err) {
                            response.msg = "Something went wrong.";
                            res.status(500).json({ ...response });
                          } else {
                            response.success = true;
                            response.msg = "article liked!";
                            res.status(200).json({ ...response });
                          }
                        });
                      } else {
                        article.likes++;
                        article.likedBy.push(user._id);
                        article.save((err) => {
                          if (err) {
                            response.msg = "Something went wrong.";
                            res.status(500).json({ ...response });
                          } else {
                            response.success = true;
                            response.msg = "article liked!";
                            res.status(200).json({ ...response });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  },

  disLikeArticle(req, res, _next) {
    let response = { success: false, msg: "" };
    if (!req.body.id) {
      response.msg = "No id was provided.";
      res.status(402).json({ ...response });
    } else {
      ArticlePost.findOne({ _id: req.body.id }, (err, article) => {
        if (err) {
          response.msg = "Invalid article id";
          res.status(402).json({ ...response });
        } else {
          if (!article) {
            response.msg = "That article was not found.";
            res.status(404).json({ ...response });
          } else {
            User.findOne({ _id: req.userData.userId }, (err, user) => {
              if (err) {
                response.msg = "Something went wrong.";
                res.status(500).json({ ...response });
              } else {
                if (!user) {
                  response.msg =
                    "You are not authorized to dislike this article";
                  res.status(402).json({ ...response });
                } else {
                  if (user._id === article.autherId) {
                    response.msg = "Cannot dislike your own post.";
                    res.status(500).json({ ...response });
                  } else {
                    if (article.dislikedBy.includes(user._id)) {
                      response.msg = "You already disliked this post.";
                      res.status(500).json({ ...response });
                    } else {
                      if (article.likedBy.includes(user._id)) {
                        article.likes--;
                        const arrayIndex = article.likedBy.indexOf(user._id);
                        article.likedBy.splice(arrayIndex, 1);
                        article.dislikes++;
                        article.dislikedBy.push(user._id);
                        article.save((err) => {
                          if (err) {
                            response.msg = "Something went wrong.";
                            res.status(500).json({ ...response });
                          } else {
                            response.success = true;
                            response.msg = "article disliked!";
                            res.status(200).json({ ...response });
                          }
                        });
                      } else {
                        article.dislikes++;
                        article.dislikedBy.push(user._id);
                        article.save((err) => {
                          if (err) {
                            response.msg = "Something went wrong.";
                            res.status(500).json({ ...response });
                          } else {
                            response.success = true;
                            response.msg = "article disliked!";
                            res.status(200).json({ ...response });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  },

  async getSpecificAdminArticles(req, res, next) {
    let response = { success: false, msg: "", articles: null };
    try {
      const checkAdmin = await User.findById(req.params.adminId);
      if (checkAdmin.role !== "admin") {
        response.msg = "This User is Not Admin";
        return res.status(401).json({ ...response });
      }
      const articles = await ArticlePost.find({ autherId: req.params.adminId })
        .populate("autherId")
        .populate("comments.commentator")
        .populate("comments.replies.replier");

      response.success = true;
      response.msg = "Fetched ...";
      response.articles = articles;

      return res.status(200).json({ ...response });
    } catch (err) {
      response.success = false;
      response.msg = "Error Occurred!";
      response.articles = null;
      const error = new Error(err);
      next(error);
      return res.status(500).json({ ...response });
    }
  },
};

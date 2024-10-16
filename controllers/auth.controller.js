import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { appConfig } from "../config/app-config.js";
import cloudinaryApi from "../config/cloudinary-api.js";

export default {
  async signup(req, res, next) {
    let response = { success: false, message: "", result: null };
    try {
      const { name, email, username, password, bio } = req.body;
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        email: email,
        username: username,
        password: hash,
        bio: bio,
      });
      const newUser = await user.save();

      response.message = "account created!";
      response.success = true;
      response.result = newUser;
      return res.status(200).json({ response });
    } catch (err) {
      console.log(err);
      response.message = "Error Occured" + err;
      response.result = null;
      response.success = false;
      return res.status(500).json({ response });
    }
  },

  async admin_signup(req, res, next) {
    let response = { success: false, message: "", result: null };
    try {
      const { name, email, username, password, bio } = req.body;
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        email: email,
        username: username,
        password: hash,
        bio: bio,
        role: "admin",
      });
      const newUser = await user.save();

      response.message = "account created!";
      response.success = true;
      response.result = newUser;
      return res.status(200).json({ response });
    } catch (err) {
      response.message = "Error Occured" + err;
      response.result = null;
      response.success = false;
      return res.status(500).json({ response });
    }
  },

  async login(req, res, next) {
    let response = {
      success: false,
      msg: "",
      role: "",
      token: null,
      userId: null,
      expiresIn: 0,
    };
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        response.msg = "Auth failed .... Email is not registered";
        return res.status(401).json({
          response,
        });
      }

      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        response.msg = "Auth failed ... Password is incorrect";
        return res.status(401).json({
          response,
        });
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        appConfig.JWT_SECRET,
        { expiresIn: "1d" }
      );
      response.success = true;
      response.token = token;
      response.role = user.role;
      response.userId = user._id;
      response.expiresIn = 86400;
      response.msg = "LoggedIn successfully";
      res.status(200).json({ response });
    } catch (err) {
      response.success = false;
      response.token = null;
      response.userId = null;
      response.expiresIn = 0;
      response.msg = "Auth failed...";
      const error = new Error();
      error.message = err;
      next(error);
      return res.status(500).json({ response });
    }
  },



  async getUsers(req, res, next) {
    const users = await User.find({});
    if (users.length < 1) res.status(500).json({ message: "No Users found" });
    res.status(200).json({ data: users });
  },

  async findUserById(req, res, next) {
    let response = { success: false, msg: "", user: null };
    try {
      const user = await User.findById(req.params.userId);
      if (!user._id) {
        response.msg = "No user found";
        return res.status(401).json({ response });
      }
      response.msg = "fetched...";
      response.success = true;
      response.user = user;
      return res.status(200).json({ response });
    } catch (e) {
      const err = new Error(err);
      next(err);
      response.msg = "Error Occurred...";
      response.success = false;
      response.user = null;
      return res.status(200).json({ response });
    }
  },

  async findUserByUsername(req, res, next) {
    let response = { success: false, msg: "", user: null };
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user._id) {
        response.msg = "No user found";
        return res.status(401).json({ response });
      }
      response.msg = "fetched...";
      response.success = true;
      response.user = user;
      return res.status(200).json({ response });
    } catch (e) {
      const err = new Error(err);
      next(err);
      response.msg = "Error Occurred...";
      response.success = false;
      response.user = null;
      return res.status(200).json({ response });
    }
  },

  async getAuthProfle(req, res, next) {
    let response = { success: false, msg: "", user: null };
    console.log(JSON.stringify(response));
    try {
      const user = await User.findById(req.userData.userId);
      if (!user._id) {
        response.msg = "No user found";
        return res.status(401).json({ response });
      }
      response.msg = "fetched...";
      response.success = true;
      response.user = user;
      return res.status(200).json({ response });
    } catch (err) {
      const error = new Error(err);
      next(error);
      response.msg = "Error Occurred...";
      response.success = false;
      response.user = null;
      return res.status(200).json({ response });
    }
  },
  /*async updateImage(req, res, next) {
    let response = { success: false, msg: "" };
    const url = req.protocol + "://" + req.get("host");
    try {
      const authUser = await User.findById(req.userData.userId);
      if (!authUser._id) {
        response.msg = "No user found";
        return res.status(401).json({ response });
      }

      let imagePath = req.body.image;
      if (req.file) {
        fileHelper.deleteFile(authUser.imageUrl);
        imagePath = url + "/images/users/" + req.file.filename;
      }

      await User.findOneAndUpdate(
        { _id: authUser._id },
        { imageUrl: imagePath },
        { new: true }
      );
      response.success = true;
      response.msg = "Image updated successfully";
      return res.status(200).json({ response });
    } catch (err) {
        response.success = false;
        response.msg = "Error Occurred!";
        const error = new Error();
        error.message = err;
        next(error);
        return res.status(500).json({ response });
    }
  },*/
};

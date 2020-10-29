import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/user.model";
import Token from "../models/token.model";
import { appConfig } from "../config/app-config";
import fileHelper from "../helpers/file.helper";

/* const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    var valid = emailRegex.test(email);
    if (!valid) return false;

    var parts = email.split('@');
    if (parts[0].length > 64) return false;

    var domainParts = parts[1].split('.');
    if (
        domainParts.some(function(part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
} */

export default {
  signup(req, res, next) {
    let response = { success: false, message: "", result: null };
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hash,
        bio: req.body.bio,
      });
      let userResult;
      user
        .save()
        .then((result) => {
          userResult = result;
          var token = new Token({
            userId: result._id,
            token: crypto.randomBytes(16).toString("hex"),
          });
          return token.save();
        })
        .then((tokenRes) => {
          var transporter = nodemailer.createTransport({
            service: "Sendgrid",
            auth: {
              user: "programmer2011515616@gmail.com",
              pass: "fLh#C$DwksH;R2R",
            },
          });
          var mailOptions = {
            from: "Mohamed Ahmed <admin@em4433.dev-articles.cloudns.cl>",
            to: userResult.email,
            subject: "Account Verification Token",
            html: `Hello ${userResult.name} <br /> <br /> Your Activation code is: ${tokenRes.token}
                            <br /> Have a good day
                            `,
          };
          return transporter.sendMail(mailOptions);
        })
        .then(() => {
          response.message =
            "check your email inbox please to verify your email!";
          response.success = true;
          response.result = userResult;
          return res.status(201).json({ response });
        })
        .catch((err) => {
          response.message = "Error Occured" + err;
          response.result = null;
          response.success = false;
          return res.status(500).json({ response });
        })
        .catch((err) => {
          response.message = "Error Occured" + err;
          response.result = null;
          response.success = false;
          return res.status(500).json({ response });
        });
    });
  },


  admin_signup(req, res, next) {
    let response = { success: false, message: "", result: null };
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hash,
        bio: req.body.bio,
        role: 'admin'
      });
      let userResult;
      user
        .save()
        .then((result) => {
          userResult = result;
          var token = new Token({
            userId: result._id,
            token: crypto.randomBytes(16).toString("hex"),
          });
          return token.save();
        })
        .then((tokenRes) => {
          var transporter = nodemailer.createTransport({
            service: "Sendgrid",
            auth: {
              user: "programmer2011515616@gmail.com",
              pass: "fLh#C$DwksH;R2R",
            },
          });
          var mailOptions = {
            from: "Mohamed Ahmed <admin@em4433.dev-articles.cloudns.cl>",
            to: userResult.email,
            subject: "Account Verification Token",
            html: `Hello ${userResult.name} <br /> <br /> Your Activation code is: ${tokenRes.token}
                            <br /> Have a good day
                            `,
          };
          return transporter.sendMail(mailOptions);
        })
        .then(() => {
          response.message =
            "check your email inbox please to verify your email!";
          response.success = true;
          response.result = userResult;
          return res.status(201).json({ response });
        })
        .catch((err) => {
          response.message = "Error Occured" + err;
          response.result = null;
          response.success = false;
          return res.status(500).json({ response });
        })
        .catch((err) => {
          response.message = "Error Occured" + err;
          response.result = null;
          response.success = false;
          return res.status(500).json({ response });
        });
    });
  },


  /**
   * POST Email Confirmation at /user/confirmation
   */

  email_confirmation(req, res, next) {
    let response = { success: false, msg: "", user: null };
    Token.findOne({ token: req.body.token })
      .then((token) => {
        if (!token) {
          response.msg =
            "We were unable to find a valid token. Your token my have expired.";
          return res.status(400).json({ response });
        }
        User.findOne({ _id: token.userId })
          .then((user) => {
            if (!user) {
              response.msg = "We were unable to find a user for this token.";
              return res.status(400).json({ response });
            }
            if (user.isVerified) {
              response.msg = "This user has already been verified.";
              return res.status(400).json({ response });
            }
            // Verify and save the user
            user.isVerified = true;
            return user.save();
          })
          .then((user) => {
            response.msg = "The account has been verified. Please log in.";
            response.success = true;
            response.user = user;
            res.status(200).json({ response });
          });
      })
      .catch((err) => {
        response.msg = "Error occured: " + err;
        response.success = false;
        response.user = null;
        res.status(500).json({ response });
      });
  },

  login(req, res, next) {
    let response = {
      success: false,
      msg: "",
      role: '',
      token: null,
      userId: null,
      expiresIn: 0,
    };
    const { email, password } = req.body;
    let fetchedUser;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          response.msg = "Auth failed .... Email is not registered";
          return res.status(401).json({
            response,
          });
        }
        response.msg = "Please Activate Your account first";
        if (!user.isVerified) {
          return res.status(401).json({ response });
        }
        fetchedUser = user;

        return bcrypt.compare(password, user.password);
      })
      .then((result) => {
        console.log(result);
        if (!result) {
          response.msg = "Auth failed ... Password is incorrect";
          return res.status(401).json({
            response,
          });
        }

        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id,
          },
          appConfig.JWT_SECRET,
          { expiresIn: "1d" }
        );
        response.success = true;
        response.token = token;
        response.role = fetchedUser.role;
        response.userId = fetchedUser._id;
        response.expiresIn = 86400;
        response.msg = "LoggedIn successfully";
        res.status(200).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.token = null;
        response.userId = null;
        response.expiresIn = 0;
        response.msg = "Auth failed...";
        const error = new Error();
        error.message = err;
        next(error);
        return res.status(401).json({ response });
      })
      .catch((err) => {
        response.success = false;
        response.token = null;
        response.userId = null;
        response.expiresIn = 0;
        response.msg = "Auth failed...";
        const error = new Error();
        error.message = err;
        next(error);
        return res.status(401).json({ response });
      });
  },

  resend_confirmation(req, res, next) {
    let response = { success: false, msg: "", result: null };
    let userResult;
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          response.msg = "We were unable to find a user with that email.";
          return res.status(400).json({ response });
        }

        if (user.isVerified) {
          response.msg =
            "This account has already been verified. Please log in.";
          return res.status(400).json({ response });
        }
        userResult = user;
        const token = new Token({
          userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        return token.save();
      })
      .then((tokenRes) => {
        var transporter = nodemailer.createTransport({
          service: "Sendgrid",
          auth: { user: "ProgMhmd2015", pass: "rbDv6s8RtwxV2aF" },
        });
        var mailOptions = {
          from: "no-reply@fp4u.com",
          to: userResult.email,
          subject: "Account Verification Token",
          html: `Hello ${userResult.name} <br /> <br /> Your Activation code is: ${tokenRes.token}
                    <br /> Have a good day
                    `,
        };
        response.msg = "check your email inbox please to verify your email!";
        response.success = true;
        response.result = userResult;
        res.status(201).json({ response });
        return transporter.sendMail(mailOptions);
      });
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
      const user = await User.findOne({username: req.params.username});
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
      const err = new Error(err);
      next(err);
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

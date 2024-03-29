const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const createInputTextCheck =
  require("../express-validator/customValidationChains").createInputTextCheck;
const passport = require("passport");

exports.index = asyncHandler(async (req, res, next) => {
  res.render("layout", {
    content: "index",
  });
});

exports.signUpGet = (req, res, next) => {
  res.render("layout", {
    title: "Signup page",
    content: "signup",
  });
};

exports.signUpPost = [
  // Form field validation and sanitization
  createInputTextCheck("firstName"),
  createInputTextCheck("lastName"),
  createInputTextCheck("userName"),
  createInputTextCheck("password"),
  // Business logic
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    console.log(req.body.firstName);

    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      user_name: req.body.userName,
      password: req.body.password,
    });

    if (!errors.isEmpty) {
      res.render("layout", {
        title: "Signup page",
        user,
        content: "signup",
      });
    }

    // Create hashed password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
      }

      user.password = hashedPassword;

      await user.save();
    });

    res.redirect("/");
  }),
];

exports.logInGet = (req, res, next) => {
  res.render("layout", {
    title: "Login page",
    content: "login",
  });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

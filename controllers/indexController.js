const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
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
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must not be empty.")
    .escape(),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name must not be empty.")
    .escape(),
  // Check whether user name is already in database
  body("userName")
    .custom(async (value) => {
      const user = await User.find({ user_name: value });

      if (user.length > 0) {
        return Promise.reject();
      }
    })
    .withMessage("User name is already in use."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty.")
    .escape(),
  // Check whether password field values match
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
  // Business logic
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      user_name: req.body.userName,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render("layout", {
        title: "Signup page",
        user,
        errors: errors.array(),
        content: "signup",
      });
    } else {
      // Create hashed password
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          next(err);
        }

        user.password = hashedPassword;

        await user.save();
      });

      res.redirect("/");
    }
  }),
];

exports.logInGet = (req, res, next) => {
  res.render("layout", {
    title: "Login page",
    content: "login",
  });
};

exports.logInPost = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/loginsuccess",
  })(req, res, next);
};

exports.logInSuccess = (req, res, next) => {
  res.render("layout", {
    content: "loginSuccess",
  });
};

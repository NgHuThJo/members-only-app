const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

function isAdmin(req) {
  return req.isAuthenticated() && req.user.is_admin;
}

exports.index = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}).populate("messages").exec();

  res.render("layout", {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: Boolean(isAdmin(req)),
    users: allUsers,
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
      is_admin: req.body.isAdmin ? true : false,
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
    failureRedirect: "/login",
  })(req, res, next);
};

exports.logInSuccess = (req, res, next) => {
  res.render("layout", {
    content: "loginSuccess",
  });
};

exports.logOut = (req, res, next) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        next(err);
      }

      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  }
};

exports.membershipGet = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.is_member) {
    res.render("layout", {
      title: "Member password",
      content: "membership",
    });
  } else {
    res.redirect("/");
  }
};

exports.membershipPost = [
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty.")
    .custom((password) => {
      return password === process.env.MEMBER_PASSWORD;
    })
    .withMessage("Wrong password.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("layout", {
        title: "Member password",
        errors: errors.array(),
        content: "membership",
      });
    } else {
      const user = req.user;

      user.is_member = true;

      await User.findByIdAndUpdate(user._id, user, {});
      res.redirect("/");
    }
  }),
];

exports.createMessageGet = (req, res, next) => {
  res.render("layout", {
    title: "Create new message",
    content: "newMessage",
  });
};

exports.createMessagePost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not be empty.")
    .escape(),
  body("message")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message must not be empty.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      timestamp: new Date(),
      message: req.body.message,
    });

    if (!errors.isEmpty()) {
      res.render("layout", {
        title: "Create new message",
        message,
        errors: errors.array(),
        content: "newMessage",
      });
    } else {
      const user = req.user;

      user.messages.push(message._id);

      await Promise.all([
        User.findByIdAndUpdate(user._id, user, {}),
        message.save(),
      ]);

      // res.redirect function call ends request-response cycle
      res.redirect("/");
    }
  }),
];

exports.deleteMessageGet = (req, res, next) => {
  res.render("layout", {
    title: "Delete message",
    content: "deleteMessage",
  });
};

exports.deleteMessagePost = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ messages: req.params.id });

  user.messages = user.messages.filter(
    (messageId) => messageId != req.params.id
  );

  await User.findByIdAndUpdate(user._id, user, {});

  res.redirect("/");
});

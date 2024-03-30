const express = require("express");
const passport = require("passport");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.index);

router.get("/signup", indexController.signUpGet);
router.post("/signup", indexController.signUpPost);

router.get("/login", indexController.logInGet);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/loginsuccess",
    failureRedirect: "/loginfailure",
  })
);

router.get("/loginfailure", indexController.logInFailure);
router.get("/loginsuccess", indexController.logInSuccess);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;

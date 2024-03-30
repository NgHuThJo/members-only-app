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
    successRedirect: "/",
    failureRedirect: "/loginfailure",
  })
);

router.get("/loginfailure", indexController.logInFailure);

module.exports = router;

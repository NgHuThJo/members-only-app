const express = require("express");
const passport = require("passport");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.index);

router.get("/signup", indexController.signUpGet);
router.post("/signup", indexController.signUpPost);

router.get("/login", indexController.logInGet);
router.post("/login", indexController.logInPost);

router.get("/loginsuccess", indexController.logInSuccess);

router.get("/logout", indexController.logOut);

router.get("/membership", indexController.membershipGet);
router.post("/membership", indexController.membershipPost);

router.get("/createmessage", indexController.createMessageGet);
// router.post("/createmessage", index.indexController.createMessagePost);

module.exports = router;

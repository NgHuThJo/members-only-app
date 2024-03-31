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

router.get("/newmessage", indexController.createMessageGet);
router.post("/newmessage", indexController.createMessagePost);

router.get("/delete/message/:id", indexController.deleteMessageGet);
router.post("/delete/message/:id", indexController.deleteMessagePost);

module.exports = router;

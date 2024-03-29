const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.index);

router.get("/signup", indexController.signUpGet);
router.post("/signup", indexController.signUpPost);

router.get("/login", indexController.logInGet);
router.post("/login", indexController.logInPost);

module.exports = router;

var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController");




// ! TO CONTROLLER
router.get("/", authController.homeGet);
router.get("/signup", authController.signUpGet);
router.post("/signup", authController.signUpPost);
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);
router.get("/logout", authController.logoutGet);

module.exports = router;
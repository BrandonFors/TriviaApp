const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

//User registration
router.post("/signup", authController.signup);

//user login
router.post("/login", authController.login);

module.exports = router;
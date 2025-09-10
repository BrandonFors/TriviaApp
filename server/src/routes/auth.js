const express = require('express');
const router = express.Router();
//User registration
router.post("/signup", authController.signup);

//user login
router.post("/login", authController.login);

// User logout
router.get("/logout", authController.logout);

module.exports = router;
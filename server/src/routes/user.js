// routes related to user data
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.post("/score", authMiddleware, userController.score);


router.get("/stats", authMiddleware, userController.stats);


router.get("/stats/category", authMiddleware, userController.stats_category);


module.exports = router;
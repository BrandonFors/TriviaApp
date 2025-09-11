// routes related to user data
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.post("/score", userController.score);


router.get("/stats", userController.stats);


router.post("/stats/category", userController.stats_category);


module.exports = router;
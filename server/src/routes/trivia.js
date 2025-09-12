// requests related to the quiz game
const express = require('express');
const triviaController = require('../controllers/triviaController');
const router = express.Router();

//questions
router.get("/questions", triviaController.questions);

module.exports = router;
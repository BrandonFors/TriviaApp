// requests related to the quiz game
const express = require('express');
const triviaController = require('../controllers/triviaController');
const router = express.Router();

//questions
router.post("/questions", triviaController.questions);

module.exports = router;
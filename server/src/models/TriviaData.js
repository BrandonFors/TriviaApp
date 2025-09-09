const mongoose = require('mongoose');

//schema for individual quiz items
const ItemSchema = new mongoose.Schema({
  difficulty: {type: String, required: true},
  numQuestions: {type: Number, required: true},
  numCorrect: {type: Number, required: true},
})
// schema for categories that will store quiz items
const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  items: {type: [ItemSchema], required: true},
})
// schema for trivia data that will store all data for a given user
const triviaDataSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true},
  totalQuestions: { type: Number, required: true},
  totalCorrect: {type: Number, required:true},
  categories: {type: [CategorySchema], required: true},
});
module.exports = mongoose.model('TriviaData', triviaDataSchema);
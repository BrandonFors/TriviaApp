const User = require("../models/User");
const TriviaData = require("../models/TriviaData");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


exports.signup = async (req, res) => {
  const { username, password } = req.body;
  let taken = false;
  try {
    const result = await User.findOne({ username });
    if (result) {
      taken = true;
      res.status(500).json({
        success: false,
        message: "Username is taken",
      });
    }
  } catch (error) {
    console.error("Error submitting data", error);
  }
  if (!taken) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const usersDoc = {
        username: username,
        password: hashedPassword,
      };
      await User.insertOne(usersDoc);
      const triviaDoc = {
        username: username,
        totalQuestions: 0,
        totalCorrect: 0,
        categories: [],
      };
      await TriviaData.insertOne(triviaDoc);
      res.status(200).json({
        success: true
      });
    } catch (error) {
      console.error("Error submitting data", error);
      res.status(201).json({
        success: false,
      });
    }
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const query = {
    username: username,
  };
  try {
    const result = await User.findOne(query);
    if (result) {
      const passwordMatch = await bcrypt.compare(password, username.password);
      if (passwordMatch) {
        const token = jwt.sign({userId: username._id}, JWT_SECRET, {
          expiresIn: '24h',
        })
        res.status(200).json({
          message: "Logged In successfully.",
          success: true,
          token
        });
      } else {
        res.status(500).json({
          message: "Password does match",
          success: false,
        });
      }
    } else {
      res.status(500).json({
        message: "Username not found.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error submitting data", error);
  }
}

exports.logout = (req, res) => {
  currentUser = "";
  loggedIn = false;
  res.send("Success");
}
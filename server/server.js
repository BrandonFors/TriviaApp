const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { MongoClient } = require("mongodb");
var mongoURL = "mongodb://localhost:27017/";
// const corsOptions = {
//     origin: "http://localhost:5173/",
// }

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(cors(corsOptions))

const client = new MongoClient(mongoURL);
let users;

async function connectDB() {
  try {
    await client.connect(); // Connect to MongoDB
    const database = client.db("TriviaApp");
    users = database.collection("users"); // Initialize the "users" collection
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}
connectDB();

var categoryArray = [];
var answerKey = [];

//trivia state variables
var setupComplete = false;
var quizOver = false;
var questions = [];
var questionIndex = 0;
var difficulty = "";
//user stuff
var currentUser = "";
var loggedIn = false;

const getCategories = async () => {
  const result = await axios.get("https://opentdb.com/api_category.php");
  categoryArray = result.data.trivia_categories;
};
getCategories();

function getIdByName(name) {
  const category = categoryArray.find((item) => item.name === name);
  return category ? category.id : null; // Return id if found, null otherwise
}
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

//testing
app.get("/", async (req, res) => {
  console.log(categoryArray);
  res.send("Hi There!");
});
app.get("/home", async (req, res) => {
  
  const data = {
    loggedIn: loggedIn,
    currentUser: currentUser,
    userData: userData,
  };
  res.json(data);
});

//questions
app.post("/questions", async (req, res) => {
  const { amount, category, difficulty } = req.body;
  const categoryId = getIdByName(category);
  const params = {
    amount,
    difficulty,
    type: "multiple",
    ...(categoryId != "Random" && { category: categoryId }), // Add 'category' only if 'categoryId' is not null
  };

  const response = await axios.get("https://opentdb.com/api.php", { params });
  const questionArray = response.data.results.map((item) => {
    const allAnswers = shuffleArray([
      item.correct_answer,
      ...item.incorrect_answers,
    ]);
    return {
      question: item.question,
      responses: allAnswers,
    };
  });

  answerKey = response.data.results.map((item) => {
    return {
      question: item.question,
      correctAnswer: item.correct_answer,
    };
  });

  res.json(questionArray);
  // res.send("Testing");
});

app.post("/check-answer", (req, res) => {
  var isCorrect = false;
  const { questionIndex, userAnswer } = req.body;
  const correctAnswer = answerKey[questionIndex].correctAnswer;
  if (correctAnswer == userAnswer) {
    isCorrect = true;
  }
  const data = {
    userAnswer,
    correctAnswer,
    isCorrect,
  };
  res.json(data);
});

app.get("/load-state", (req, res) => {
  const data = {
    setupComplete,
    quizOver,
    questions,
    questionIndex,
    difficulty,
  };
  res.json(data);
});

app.post("/save-state", (req, res) => {
  setupComplete = req.body.setupComplete;
  quizOver = req.body.quizOver;
  questions = req.body.questions;
  questionIndex = req.body.questionIndex;
  difficulty = req.body.difficulty;
  console.log({
    setupComplete,
    quizOver,
    questions,
    questionIndex,
    difficulty,
  });
  res.send("States updated.");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = users.findOne({username});
    if(result){
      res.json({
        success: false,
        message: "Username is taken"
      });
    }
  } catch (error) {
    console.error("Error submitting data", error);
  }

  try {
    const doc = {
      username: username,
      password: password,
      overallCorrect: 0,
      overallIncorrect: 0,
      accuracyPct: 0,
    };
    const result = await users.insertOne(doc);
  } catch (error) {
    console.error("Error submitting data", error);
    res.json({
      success: false,
    });
  }
  res.json({
    success: true,
  });
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = {
    username: username,
  };
  try {
    const result = await users.findOne(query);
    if (result) {
      if (password == result.password) {
        currentUser = username;
        loggedIn = true;
        res.json({
          message: "Logged In successfully.",
          success: true,
        });
      } else {
        res.json({
          message: "Password does match",
          success: false,
        });
      }
    } else {
      res.json({
        message: "Username not found.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error submitting data", error);
  }
});
app.get("/logout", (req, res) => {
  currentUser = "";
  loggedIn = false;
  userData = {};
  res.send("Success");
});

process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

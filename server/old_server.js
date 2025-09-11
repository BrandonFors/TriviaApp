
////////////////////// FIXING IN PROGRESS \\\\\\\\\\\\\\\\\\\\\
const dotenv = require('dotenv'); // figure out environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new MongoClient(process.env.MONGO_URL);
const JWT_SECRET = process.env.JWT_SECRET;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("TriviaApp");
    users = database.collection("users");
    triviaData = database.collection("triviaData");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
connectDB();

var categoryArray = [];
var answerKey = [];

//trivia state 
var setupComplete = false;
var quizOver = false;
var questions = [];
var questionIndex = 0;
var difficulty = "";
//user stuff
var currentUser = "";
var loggedIn = false;

function authenticateToken(req, res){
  
}


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
  // console.log(categoryArray);
  res.send("Hi There!");
});
app.get("/home", async (req, res) => {
  if (loggedIn) {
    try {
      const result = await users.findOne(query);
    } catch (error) {}
  }

  const data = {
    loggedIn: loggedIn,
    currentUser: currentUser,
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
  // console.log({
  //   setupComplete,
  //   quizOver,
  //   questions,
  //   questionIndex,
  //   difficulty,
  // });
  res.send("States updated.");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  let taken = false;
  try {
    const result = await users.findOne({ username });
    if (result) {
      taken = true;
      res.json({
        success: false,
        message: "Username is taken",
      });
    }
  } catch (error) {
    console.error("Error submitting data", error);
  }
  if (!taken) {
    try {
      const usersDoc = {
        username: username,
        password: password,
      };
      await users.insertOne(usersDoc);
      const triviaDoc = {
        username: username,
        totalQuestions: 0,
        totalCorrect: 0,
        categories: [],
      };
      await triviaData.insertOne(triviaDoc);
    } catch (error) {
      console.error("Error submitting data", error);
      res.json({
        success: false,
      });
    }
  }

  if (!res.headersSent) {
    return res.json({ success: true });
  }
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
  res.send("Success");
});

app.post("/score", async (req, res) => {
  if (loggedIn) {
    const { score, amtQuestions, category, difficulty } = req.body;

    try {
      const userDoc = await triviaData.findOne(
        { username: currentUser },
        { projection: { categories: 1, totalCorrect: 1, totalQuestions: 1 } }
      );

      let categoryExists = false;
      let difficultyExists = false;
      let existingTotalQuestions = 0;
      let existingTotalCorrect = 0;
      let existingNumQuestions = 0;
      let existingNumCorrect = 0;

      if (userDoc) {
        existingTotalQuestions = userDoc.totalQuestions;
        existingTotalCorrect = userDoc.totalCorrect;

        const categoryObj = userDoc.categories?.find(
          (categoryObj) => categoryObj.name === category
        );
        if (categoryObj) {
          categoryExists = true;

          const matchedItem = categoryObj.items.find(
            (item) => item.difficulty === difficulty
          );
          if (matchedItem) {
            difficultyExists = true;
            existingNumQuestions = matchedItem.numQuestions || 0;
            existingNumCorrect = matchedItem.numCorrect || 0;
          }
        }
      }

      const updatedTotalQuestions = existingTotalQuestions + amtQuestions;
      const updatedTotalCorrect = existingTotalCorrect + score;

      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };

      if (!categoryExists) {
        const updateDoc = {
          $push: {
            categories: {
              name: category,
              items: [
                {
                  difficulty,
                  numQuestions: amtQuestions,
                  numCorrect: score,
                },
              ],
            },
          },
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
          },
        };

        await triviaData.updateOne({ username: currentUser }, updateDoc, {
          upsert: true,
        });
      } else if (!difficultyExists) {
        const updateDoc = {
          $push: {
            "categories.$.items": {
              difficulty,
              numQuestions: amtQuestions,
              numCorrect: score,
            },
          },
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
          },
        };

        await triviaData.updateOne(
          { username: currentUser, "categories.name": category },
          updateDoc
        );
      } else {
        const updatedNumQuestions = existingNumQuestions + amtQuestions;
        const updatedNumCorrect = existingNumCorrect + score;

        const filter = {
          username: currentUser,
          "categories.name": category,
        };

        const updateDoc = {
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
            "categories.$.items.$[item].numQuestions": updatedNumQuestions,
            "categories.$.items.$[item].numCorrect": updatedNumCorrect,
          },
        };

        const options = {
          arrayFilters: [{ "item.difficulty": difficulty }],
        };

        await triviaData.updateOne(filter, updateDoc, options);
      }

      await triviaData.updateOne(
        { username: currentUser, "categories.name": category },
        {
          $set: {
            "categories.$.items": userDoc.categories
              .find((cat) => cat.name === category)
              .items.sort(
                (a, b) =>
                  difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
              ),
          },
        }
      );

      res.json({
        success: true,
        message: "Data updated successfully.",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      //update all to be this format
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    return res.send("No Login");
  }
});
app.get("/stats", async (req, res) => {
  try {
    const filter = {
      username: currentUser,
    };
    const projection = {
      "categories.name": 1,
    };
    const userDoc = await triviaData.findOne(filter, { projection });
    console.log(userDoc.categories);
    res.json(userDoc.categories);
  } catch (error) {
    console.error("Error fetching category items:", error);
  }
});
app.post("/stats/category", async (req, res) => {
  const { category } = req.body;

  try {
    const filter = {
      username: currentUser,
      "categories.name": category,
    };

    const projection = {
      "categories.$": 1,
    };
    const userDoc = await triviaData.findOne(filter, { projection });
    console.log(userDoc);
    res.json(userDoc);
  } catch (error) {
    console.error("Error fetching category items:", error);
  }
});

process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const express =require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
// const corsOptions = {
//     origin: "http://localhost:5173/",
// }

const app = express();
const port = 8080;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
// app.use(cors(corsOptions))

var categoryArray = []
var answerKey = []

//trivia state variables
var setupComplete = false;
var quizOver = false;
var questions = [];
var questionIndex = 0;
//tbd
var userData = {

}

const getCategories = async () =>{
    const result = await axios.get("https://opentdb.com/api_category.php");
    categoryArray =  result.data.trivia_categories;
}
getCategories()

function getIdByName(name) {
    const category = categoryArray.find(item => item.name === name);
    return category ? category.id : null; // Return id if found, null otherwise
}
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

//testing
app.get("/",async (req, res)=>{
    console.log(categoryArray);
    res.send("Hi There!")

})
//questions
app.post("/questions", async (req, res) => {
    const { amount, category, difficulty } = req.body;
    const categoryId = getIdByName(category);
    const params = {
    amount,
    difficulty,
    type: 'multiple',
    ...(categoryId != "Any" && { category: categoryId }) // Add 'category' only if 'categoryId' is not null
    };

    const response = await axios.get("https://opentdb.com/api.php", { params });
    const questionArray = response.data.results.map(item => {
        const allAnswers = shuffleArray([item.correct_answer, ...item.incorrect_answers]);
        return {
          question: item.question,
          responses: allAnswers
        };
    });

    answerKey = response.data.results.map(item => {
        return {
          question: item.question,
          correctAnswer: item.correct_answer
        };
    });
    
    res.json(questionArray);
    // res.send("Testing");
});

app.post("/check-answer", (req,res)=>{
    var isCorrect = false;
    const {questionIndex, userAnswer} = req.body;
    const correctAnswer = answerKey[questionIndex].correctAnswer;
    if(correctAnswer == userAnswer){
        isCorrect = true;
    }
    const data = {
        userAnswer,
        correctAnswer,
        isCorrect

    }
    res.json(data);

})


app.get("/load-state",(req,res)=>{
    const data = {
        setupComplete,
        quizOver,
        questions,
        questionIndex,
        
    }
    res.json(data)
})

app.post("/save-state",(req,res)=>{
    setupComplete = req.body.setupComplete;
    quizOver = req.body.quizOver;
    questions = req.body.questions;
    questionIndex = req.body.questionIndex;
    res.send("States updated.")
});







app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
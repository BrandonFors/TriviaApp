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
var answerData = []
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
    ...(categoryId && { category: categoryId }) // Add 'category' only if 'categoryId' is not null
    };

    const response = await axios.get("https://opentdb.com/api.php", { params });
    const questionArray = response.data.results.map(item => {
        const allAnswers = shuffleArray([item.correct_answer, ...item.incorrect_answers]);
        return {
          question: item.question,
          responses: allAnswers
        };
    });

    answerData = response.data.results.map(item => {
        return {
          question: item.question,
          correctAnswer: item.correct_answer,
          userAnswer: "",
          isCorrect: false
        };
    });
    
    res.json(questionArray);
    // res.send("Testing");
});





app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
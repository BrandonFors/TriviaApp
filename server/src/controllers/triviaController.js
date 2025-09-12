// controllers that handle trivia
const axios = require('axios');

let categoryArray = []

// gets the category name/id combinations from the opendb api
const getCategories = async () => {
  if(categoryArray.length == 0){
    const result = await axios.get("https://opentdb.com/api_category.php");
    categoryArray = result.data.trivia_categories;
  }
};
// shuffles the questions
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
// finds the corresponding Id for the category sent by the frontend
function getIdByName(name) {
  const category = categoryArray.find((item) => item.name === name);
  return category ? category.id : null; // Return id if found, null otherwise
}



// serves questions specific to user input that is passed through the request body
exports.questions = async (req, res) => {
  try{
    await getCategories();
    const { amount, category, difficulty } = req.query;
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

    const answerKey = response.data.results.map((item) => {
      return {
        question: item.question,
        correctAnswer: item.correct_answer,
      };
    });

    res.status(200).json({
      "questionArray": questionArray,
      "answerKey": answerKey,
    });
  }catch(error){
    res.status(500).json({"message":"Error fetching questions"});
  }
  

}
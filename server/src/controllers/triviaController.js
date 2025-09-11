// controllers that handle trivia


exports.questions = async (req, res) => {
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
}
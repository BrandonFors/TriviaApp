// Serves as the main trivia quiz page and is a centeralized location for quiz functionality
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SetupForm from "./SetupForm";
import QuestionForm from "./QuestionForm";
import ResultsForm from "./ResultsForm";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
function TriviaPage() {
  // is True or False based on if the user has input all necessary info for a quiz to begin
  const [setupComplete, setSetupComplete] = useState(false);
  // True or False based on if a quiz is in progress
  const [quizOver, setQuizOver] = useState(false);
  // loading state for when the frontend is fetching questions
  const [loading, setLoading] = useState(false);
  // holds quiz questions
  const [questions, setQuestions] = useState([]);
  // stores the answer key
  const [answerKey, setAnswerKey] = useState([]);
  // holds info on what questions the user is on
  const [questionIndex, setQuestionIndex] = useState(0);
  // holds info on the difficulty of the quiz
  const [difficulty, setDifficulty] = useState("");
  // is triggered when exit is pressed, which triggers a useEffect to nav back to homepage. Is there a better way to handle this?
  const [shouldNavigate, setShouldNavigate] = useState(false);
  // gets category from url
  const { category } = useParams();
  //handles navigation from page
  const navigate = useNavigate();

  // handles getting questions from the backend
  const getQuestions = async (amount, difficulty) => {
    console.log(amount);
    console.log(difficulty);
    console.log(category);
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/trivia/questions",
        {
          params: { amount, category, difficulty },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  //checks the user's input answer using the backend
  const checkAnswer = async (questionIndex, userAnswer) => {
    // implement answer logic
    console.log(answerKey[questionIndex]);
    return userAnswer == answerKey[questionIndex];
  };

  // resets the users quiz state once the quiz is over
  const resetState = async () => {
    const state = {
      setupComplete: false,
      quizOver: false,
      questions: [],
      questionIndex: 0,
      difficulty: "",
    };
  };

  // submits the user's quiz score and details about the quiz
  const submitScore = async (score, amtQuestions, category, difficulty) => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token) {
        await axios.post("http://localhost:8080/user/score", {
          headers: { Authorization: `Bearer ${token}` },
          username,
          score,
          amtQuestions,
          category,
          difficulty,
        });
      }
    } catch (error) {
      console.error("Error submitting score", error);
    }
  };

  // handles when a quiz is started
  const handleStartPressed = async (amount, difficulty) => {
    // fetches questions
    const data = await getQuestions(amount, difficulty);
    setQuestions(data.questionArray);
    setAnswerKey(data.answerKey);
    setSetupComplete(true);
  };

  // handles when the user submits an answer to a question
  const handleSubmitPressed = async (userAnswer) => {
    let isCorrect = checkAnswer(questionIndex, userAnswer);

    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              userAnswer: userAnswer,
              correctAnswer: answerKey[questionIndex].correctAnswer,
              isCorrect: isCorrect,
            }
          : question
      )
    );
  };

  const handleNextQuestionPressed = () => {
    setQuestionIndex((prevValue) => prevValue + 1);
    console.log(questionIndex);
  };
  const handleResultsPressed = () => {
    setQuizOver(true);
  };

  const handleExitPressed = async (score, amtQuestions) => {
    await submitScore(score, amtQuestions, category, difficulty);
    resetState();
    setShouldNavigate(true);
  };

  // navigates to home if shouldNavigate is true
  useEffect(() => {
    if (shouldNavigate) {
      navigate("/");
    }
  }, [shouldNavigate]);

  return (
    <div>
      <h1>
        <span>
          <LightbulbIcon fontSize="x-large"></LightbulbIcon>
        </span>
        {`${category} Trivia`}
      </h1>
      {/* Displays dificulty if there is one present */}
      {difficulty != "" && (
        <h2>{`${
          difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        } Difficulty`}</h2>
      )}
      {/* This container contains all the necesary UI steps for a quiz: 
        - A setup form for the user to select amt of questions and dificulty
        - A question form that will deliver the actual quiz one question at a time
        - A resutls form where the user can view their correct and incorrect answers
      All of these are shown based on states and most quiz functionality resides in this file */}
      <div className="trivia-container">
        {/* Displays the setup form */}
        {!setupComplete && !loading && (
          <SetupForm handleStartPressed={handleStartPressed} />
        )}
        {/* Displays the question form */}
        {!quizOver && setupComplete && !loading && (
          <QuestionForm
            questions={questions}
            questionIndex={questionIndex}
            questionsLength={questions.length}
            handleSubmitPressed={handleSubmitPressed}
            handleNextQuestionPressed={handleNextQuestionPressed}
            handleResultsPressed={handleResultsPressed}
          />
        )}
        {/* Displays results form */}
        {quizOver && !loading && (
          <ResultsForm
            questions={questions}
            handleExitPressed={handleExitPressed}
          ></ResultsForm>
        )}
        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
}

export default TriviaPage;

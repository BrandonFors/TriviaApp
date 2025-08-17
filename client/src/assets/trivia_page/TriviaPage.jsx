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
  // loading state for when the user submits an answer to the backend
  const [answerLoading, setAnswerLoading] = useState(false);
  // holds quiz questions
  const [questions, setQuestions] = useState([]);
  // holds info on what questions the user is on
  const [questionIndex, setQuestionIndex] = useState(0);
  // holds info on the difficulty of the quiz
  const [difficulty, setDifficulty] = useState("");
  // tells whether the frontend is restoring quiz progress
  const [restoringState, setRestoringState] = useState(true);
  // is triggered when exit is pressed, which triggers a useEffect to nav back to homepage. Is there a better way to handle this?
  const [shouldNavigate, setShouldNavigate] = useState(false);
  // gets category from url
  const { category } = useParams();
  //handles navigation from page
  const navigate = useNavigate();

  // handles getting questions from the backend
  const getQuestions = async (amount, difficulty) => {
    try {
      setLoading(true);
      const postData = {
        amount,
        category,
        difficulty,
      };
      const response = await axios.post(
        "http://localhost:8080/questions",
        postData
      );
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
    setAnswerLoading(true);
    try {
      const postData = {
        questionIndex,
        userAnswer,
      };
      const response = await axios.post(
        "http://localhost:8080/check-answer",
        postData
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking answer:", error);
      return [];
    } finally {
      setAnswerLoading(false);
    }
  };
  // loads the user's quiz state if they reload the page for some reson
  const loadState = async () => {
    try {
      const response = await axios.get("http://localhost:8080/load-state");
      const savedState = response.data;
      if (savedState) {
        setSetupComplete(savedState.setupComplete);
        setQuizOver(savedState.quizOver);
        setQuestions(savedState.questions || []);
        setQuestionIndex(savedState.questionIndex || 0);
        setDifficulty(savedState.difficulty);
      }
    } catch (error) {
      console.error("Error loading state from backend: ", error);
    } finally {
      setRestoringState(false);
    }
  };
  //saves the user's quiz state
  const saveState = async () => {
    try {
      const state = {
        setupComplete,
        quizOver,
        questions,
        questionIndex,
        difficulty,
      };
      await axios.post("http://localhost:8080/save-state", state);
    } catch (error) {
      console.error("Error saving state to backend: ", error);
    }
  };
  // resets the users quiz state once the quiz is over
  const resetState = async () => {
    try {
      const state = {
        setupComplete: false,
        quizOver: false,
        questions: [],
        questionIndex: 0,
        difficulty: "",
      };
      await axios.post("http://localhost:8080/save-state", state);
    } catch (error) {
      console.error("Error saving reset  state backend: ", error);
    }
  };

  // submits the user's quiz score and details about the quiz
  const submitScore = async (score, amtQuestions, category, difficulty) => {
    try {
      const postData = {
        score,
        amtQuestions,
        category,
        difficulty,
      };
      await axios.post("http://localhost:8080/score", postData);
    } catch (error) {
      console.error("Error submitting score", error);
    }
  };

  // rests the quiz
  const handlePopState = async () => {
    resetState();
  };

  // handles when a quiz is started
  const handleStartPressed = async (amount, difficulty) => {
    // fetches questions
    const data = await getQuestions(amount, difficulty);
    setDifficulty(difficulty);
    setQuestions(data);
    setSetupComplete(true);
  };

  // handles when the user submits an answer to a question
  const handleSubmitPressed = async (userAnswer) => {
    const data = await checkAnswer(questionIndex, userAnswer);
    if (data != []) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
          index === questionIndex
            ? {
                ...question,
                userAnswer: data.userAnswer,
                correctAnswer: data.correctAnswer,
                isCorrect: data.isCorrect,
              }
            : question
        )
      );
    }
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

  // Reset state only when the back button is pressed
  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);''

  // loads the state on page start
  useEffect(() => {
    setLoading(false);
    setAnswerLoading(false);
    loadState();
  }, []);

  // sends quiz state to the backend every half second. Is there a better way to do this?
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState();
    }, 500);
    return () => clearTimeout(timer);
  }, [setupComplete, quizOver, questions, questionIndex]);

  // navigates to home if shouldNavigate is true
  useEffect(() => {
    if (shouldNavigate) {
      navigate("/");
    }
  }, [shouldNavigate]);

  // displays spinner if loading state
  if (restoringState) {
    return <div className="spinner"></div>;
  }

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
            answerLoading={answerLoading}
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

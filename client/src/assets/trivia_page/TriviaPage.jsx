import React, { useEffect, useState } from "react";
import './TriviaPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import SetupForm from "./SetupForm";
import QuestionForm from "./QuestionForm";
import ResultsForm from "./ResultsForm";

function TriviaPage() {
    const [setupComplete, setSetupComplete] = useState(false);
    const [quizOver, setQuizOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [difficulty, setDifficulty] = useState("");
    const [restoringState, setRestoringState] = useState(true);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const {category} = useParams();
    const navigate = useNavigate();

    const getQuestions = async (amount, difficulty) => {
        try {
            setLoading(true);
            const postData = { 
                amount, 
                category, 
                difficulty 
            };
            const response = await axios.post("http://localhost:8080/questions", postData);
            return response.data;
        } catch (error) {
            console.error("Error fetching questions:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };
    const checkAnswer = async(questionIndex, userAnswer) =>{
        setLoading(true);
        try{
            const postData = {
                questionIndex,
                userAnswer
            };
            const response = await axios.post("http://localhost:8080/check-answer", postData)
            console.log(response.data)
            return response.data;
        }catch(error){
            console.error("Error checking answer:", error);
            return [];
        }finally{
            setLoading(false);
        }
        


    }

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

    const saveState = async () => {
        try {
            const state = {
                setupComplete,
                quizOver,
                questions,
                questionIndex,
                difficulty
            };
            await axios.post("http://localhost:8080/save-state", state);
        } catch (error) {
            console.error("Error saving state to backend: ", error);
        }
    };
    const resetState = async () =>{
        try {
            const state = {
                setupComplete: false,
                quizOver: false,
                questions: [],
                questionIndex: 0,
                difficulty: ""
            };
            await axios.post("http://localhost:8080/save-state", state);
        } catch (error) {
            console.error("Error saving reseting state backend: ", error);
        }
    }

    const handlePopState = async () => {
        resetState()
    };

    const handleStartPressed = async (amount, difficulty) => {
        const data = await getQuestions(amount, difficulty);
        setDifficulty(difficulty);
        setQuestions(data);
        setSetupComplete(true);
    };

    const handleSubmitPressed = async (userAnswer) => {
        const data = await checkAnswer(questionIndex,userAnswer);
        if(data != []){
            setQuestions((prevQuestions) =>
                prevQuestions.map((question, index) =>
                    index === questionIndex
                        ? { ...question, 
                            userAnswer: data.userAnswer,
                            correctAnswer: data.correctAnswer,
                            isCorrect: data.isCorrect
    
                        } 
                        : question
                )
            );
        } 
    };

    const handleNextQuestionPressed = () => {
        setQuestionIndex((prevValue)=>prevValue+1);
        console.log(questionIndex);
    };
    const handleResultsPressed = () =>{
        setQuizOver(true);
    }
    const handleExitPressed = async () => {
        resetState();
        setShouldNavigate(true);
    };

    // Reset state only when the back button is pressed
    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        setLoading(false);
        loadState();
    }, []);

    
    useEffect(() => {
        const timer = setTimeout(() => {
            saveState();
        }, 500);
        return () => clearTimeout(timer);
    }, [setupComplete, quizOver, questions, questionIndex]);

    useEffect(() => {
        if (shouldNavigate) {
            navigate('/');
        }
    }, [shouldNavigate]);

    if (restoringState) {
        return <div className="spinner"></div>;
    }


    return (
        <div>
            <h1>{`${category} Trivia`}</h1>
            {difficulty != "" && <h2>{`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode`}</h2>}
            {!setupComplete && !loading && (
                <SetupForm handleStartPressed={handleStartPressed} />
            )}
            {!quizOver && setupComplete && !loading && (
                <QuestionForm
                    questions={questions}
                    questionIndex = {questionIndex}
                    questionsLength = {questions.length}
                    handleSubmitPressed = {handleSubmitPressed}
                    handleNextQuestionPressed = {handleNextQuestionPressed}
                    handleResultsPressed = {handleResultsPressed}
                />
            )}
            {quizOver && !loading &&(
                <ResultsForm 
                questions = {questions}
                handleExitPressed = {handleExitPressed}
                ></ResultsForm>
            )}
            {loading && (
                <div className="spinner"></div>

            )}
            
        </div>
    );
}

export default TriviaPage;

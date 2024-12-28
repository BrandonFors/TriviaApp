import React, { useEffect, useState } from "react";
import './TriviaPage.css';
import { useParams } from 'react-router-dom';
import axios from "axios";
import SetupForm from "./SetupForm";
import QuestionForm from "./QuestionForm";

function TriviaPage() {
    const [setupComplete, setSetupComplete] = useState(false);
    const [quizOver, setQuizOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [restoringState, setRestoringState] = useState(true);
    const { category } = useParams();

    const getQuestions = async (amount, difficulty) => {
        try {
            setLoading(true);
            const postData = { amount, category, difficulty };
            const response = await axios.post("http://localhost:8080/questions", postData);
            return response.data;
        } catch (error) {
            console.error("Error fetching questions:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleStartPressed = async (amount, difficulty) => {
        const data = await getQuestions(amount, difficulty);
        setQuestions(data);
        setSetupComplete(true);
    };

    const handleSubmitPressed = () => {
        if (questionIndex === questions.length - 1) {
            setQuizOver(true);
        } else {
        }
    };

    const handleNextQuestionPressed = () => {
    };

    const handleExitPressed = () => {
        setQuestions([]);
        setSetupComplete(false);
        setQuestionIndex(0);
    };

    const loadState = async () => {
        try {
            const response = await axios.get("http://localhost:8080/load-state");
            const savedState = response.data;
            if (savedState) {
                setSetupComplete(savedState.setupComplete);
                setQuizOver(savedState.quizOver);
                setQuestions(savedState.questions || []);
                setQuestionIndex(savedState.questionIndex || 0);
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
            };
            await axios.post("http://localhost:8080/save-state", state);
        } catch (error) {
            console.error("Error saving state to backend: ", error);
        }
    };

    useEffect(() => {
        loadState();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveState();
        }, 500);
        return () => clearTimeout(timer);
    }, [setupComplete, quizOver, questions, questionIndex]);

    if (restoringState) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <h1>{category}</h1>
            {!setupComplete && (
                <SetupForm handleStartPressed={handleStartPressed} />
            )}
            {setupComplete && loading && (
                <div className="spinner"></div>
            )}
            {setupComplete && !loading && (
                <QuestionForm
                    question={questions[questionIndex]}
                />
            )}
        </div>
    );
}

export default TriviaPage;

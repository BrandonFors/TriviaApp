import React, { useEffect, useState } from "react";
import './TriviaPage.css';
import { useParams } from 'react-router-dom';
import axios from "axios";
import SetupForm from "./SetupForm";
import QuestionForm from "./QuestionForm";

function TriviaPage(){
    const [setupComplete, setSetupComplete] = useState(false);
    const [quizOver, setQuizOver] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [buttonText,setButtonText] = useState("Submit Answer");
    const { category } = useParams();


    const getQuestions = async (amount, difficulty)=>{
        try {
            const postData = { amount, category, difficulty };
            const response = await axios.post("http://localhost:8080/questions", postData);
            console.log(response.data);
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }

    const handleStartPressed = (amount, difficulty)=>{
        getQuestions(amount,difficulty);
        setSetupComplete(true);

    }
    const handleSubmitPressed = () =>{

    }
    const handleNextQuestionPressed = ()=>{

    }
    const handleExitPressed = (event)=>{
        setQuestions([]);
        setSetupComplete(false);
        setQuestionIndex(0);
    }

    return(
        <div>
            <h1>{category}</h1>
            {!setupComplete && <SetupForm handleStartPressed = {handleStartPressed}></SetupForm>}
            {setupComplete && <QuestionForm buttonText = {buttonText} question = {questions[questionIndex]}></QuestionForm>}
        </div>
    )
}
export default TriviaPage
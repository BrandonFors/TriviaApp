import React, { useEffect, useState } from "react";
import "./TriviaPage.css";

function QuestionForm(props) {
    const [answer, setAnswer] = useState("");
    const [question, setQuestion] = useState(props.questions[props.questionIndex])
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const decodeHtmlEntities = (text) => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html').body.textContent;
    };
    useEffect(() => {
        setQuestion(props.questions[props.questionIndex]);
        setAnswer("");
        if(props.questionIndex +1 == props.questions.length){
            setIsLastQuestion(true);
        }else{ 
            setIsLastQuestion(false);
        }
        }, [props.questions, props.questionIndex]);

    return (
        <div className="question-container">
            <h2>{`Question ${props.questionIndex+1}: ${decodeHtmlEntities(question.question)}`}</h2>
            {!props.checkLoading && <div className="button-container">
                {!question.userAnswer && question.responses.map((response, index) => (
                    <button
                        key={index}
                        onClick={() => setAnswer(response)}
                        className={answer === response ? 'selected' : ''}
                    >
                        {decodeHtmlEntities(response)}
                    </button>
                ))}
                {question.userAnswer && question.responses.map((response, index) => {
                    let buttonClass = "";
                    if (response === question.correctAnswer) {
                        buttonClass = "correct"; 
                    } else if (response === question.userAnswer) {
                        buttonClass = "incorrect"; 
                    }
                    return (
                        <button key={index} className={buttonClass}>{decodeHtmlEntities(response)}</button>
                    );
                })}
            </div>}
            {props.checkLoading && <div className="spinner"></div> }
            
            {!question.userAnswer && answer !== "" && <button onClick={()=>{props.handleSubmitPressed(answer)}}>{"Submit"}</button>}
            {!isLastQuestion && question.userAnswer && <button onClick={()=>{props.handleNextQuestionPressed()}}>{"Next Question"}</button>}
            {isLastQuestion && question.userAnswer && <button onClick={()=>{props.handleResultsPressed()}}>{"Results"}</button>}

            
        </div>
    );
}

export default QuestionForm;
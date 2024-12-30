import React, { useEffect, useState } from "react";
import "./TriviaPage.css";
import ResultElement from "./ResultElement";
function ResultsForm(props){
    const [score, setScore] = useState(0);

    useEffect(() => {
        setScore(() => {
            let newScore = 0;
            props.questions.forEach((question) => {
                if (question.isCorrect) {
                    newScore++;
                }
            });
            return newScore;
        });
    }, [props.questions]);
    return(
        <div>
            <h1>Results</h1>
                <h2>{`Score: ${score}/${props.questions.length}`}</h2>
                {props.questions.map((question, index)=>(
                    <ResultElement 
                    key = {index}
                    index = {index}
                    question = {question}
                    ></ResultElement>
                ))}
            <button onClick={() => props.handleExitPressed()}>Exit</button>
        </div>
        
    )
    

}
export default ResultsForm;
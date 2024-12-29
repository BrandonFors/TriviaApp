import React, { useEffect, useState } from "react";
import "./TriviaPage.css";
import ResultElement from "./ResultElement";
function ResultsForm(props){
    return(
        <div>
            <h1>Results</h1>
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
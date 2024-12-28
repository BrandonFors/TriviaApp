import React, { useEffect, useState } from "react";

function QuestionForm(props){
    const [answer, setAnswer] = useState("");
    return(
    <div>
        <h1>{props.question.question}</h1>
        {
            props.question.responses.map((response, index)=>{
                <button
                    key={index}
                    onClick={() => setAnswer(answer)}
                    className={answer === response ? 'selected' : ''}
                    >
                    {response}
                    </button>
            })       
        }
        {answer != "" && <button>{props.buttonText}</button>}
    </div>
    )
    
}
export default QuestionForm;
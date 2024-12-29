import React, { useEffect, useState } from "react";
import "./TriviaPage.css";

function QuestionForm(props) {
    const [answer, setAnswer] = useState("");
    const [question, setQuestion] = useState(props.questions[props.questionIndex])
    const decodeHtmlEntities = (text) => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html').body.textContent;
    };

    return (
        <div>
            <h1>{decodeHtmlEntities(question.question)}</h1>
            {question.responses.map((response, index) => (
                <button
                    key={index}
                    onClick={() => setAnswer(response)}
                    className={answer === response ? 'selected' : ''}
                >
                    {decodeHtmlEntities(response)}
                </button>
            ))}
            {answer !== "" && <button onClick={()=>{props.handleSubmit}}>{}</button>}
        </div>
    );
}

export default QuestionForm;
// Displays a question, the given answer, and the right answer
import React, { useEffect, useState } from "react";

function ResultElement(props) {
  const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html").body.textContent;
  };
  return (
    <div>
      {/* Displays the question */}
      <h3>{`${props.index + 1}. ${decodeHtmlEntities(
        props.question.question
      )}`}</h3>
      {/* Displays given and correct answers and changes their class names based on correctness for red or green coloring*/}
      <button className={props.question.isCorrect ? "correct" : "incorrect"}>
        {decodeHtmlEntities(props.question.userAnswer)}
      </button>
      <button className="correct">
        {decodeHtmlEntities(props.question.correctAnswer)}
      </button>
    </div>
  );
}
export default ResultElement;

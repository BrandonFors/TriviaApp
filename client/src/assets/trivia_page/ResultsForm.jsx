// Form to display results from a quiz
import React, { useEffect, useState } from "react";
import ResultElement from "./ResultElement";
function ResultsForm(props) {
  const [score, setScore] = useState(0);
  // calculates the score for the quiz based on right or wrong answers
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

  return (
    <div>
      <h1>Results</h1>
      <h2>{`Score: ${score}/${props.questions.length}`}</h2>
      {/* Displays a section for each question containing the question, the given answer, and the correct answer */}
      {props.questions.map((question, index) => (
        <ResultElement
          key={index}
          index={index}
          question={question}
        ></ResultElement>
      ))}
      {/* exit button back to home */}
      <button
        onClick={() => props.handleExitPressed(score, props.questions.length)}
      >
        Exit
      </button>
    </div>
  );
}
export default ResultsForm;

// Serves a question with 4 options for answers to the user
import React, { useEffect, useState } from "react";
function QuestionForm(props) {
  // stores question details
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(
    props.questions[props.questionIndex]
  );
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  // decodes the question text
  const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html").body.textContent;
  };
  // detects if the question is the last question
  useEffect(() => {
    setQuestion(props.questions[props.questionIndex]);
    setAnswer("");
    if (props.questionIndex + 1 == props.questions.length) {
      setIsLastQuestion(true);
    } else {
      setIsLastQuestion(false);
    }
  }, [props.questions, props.questionIndex]);

  return (
    // Contains the question text
    <div className="question-container">
      <h2>{`Question ${props.questionIndex + 1}: ${decodeHtmlEntities(
        question.question
      )}`}</h2>
      {!props.answerLoading && (
        //contains buttons and creates buttons for every question answer, stylizes based on user clicks
        <div className="button-container">
          {!question.userAnswer &&
            question.responses.map((response, index) => (
              <button
                key={index}
                onClick={() => setAnswer(response)}
                className={answer === response ? "selected" : ""}
              >
                {decodeHtmlEntities(response)}
              </button>
            ))}
          {/* If the user has answered, style buttons based on the real correct answer and the user anser with red and green */}
          {question.userAnswer &&
            question.responses.map((response, index) => {
              let buttonClass = "";
              if (response === question.correctAnswer) {
                buttonClass = "correct";
              } else if (response === question.userAnswer) {
                buttonClass = "incorrect";
              }
              return (
                <button key={index} className={buttonClass}>
                  {decodeHtmlEntities(response)}
                </button>
              );
            })}
        </div>
      )}
      {/* handles loading */}
      {props.answerLoading && <div className="spinner"></div>}
      {/* If the user has not answered, display a submit button */}
      {!question.userAnswer && answer !== "" && (
        <button
          onClick={() => {
            props.handleSubmitPressed(answer);
          }}
        >
          {"Submit"}
        </button>
      )}
      {/* If the user has answered and it is not the last question, display a next question button */}
      {!isLastQuestion && question.userAnswer && (
        <button
          onClick={() => {
            props.handleNextQuestionPressed();
          }}
        >
          {"Next Question"}
        </button>
      )}
      {/* If it is the last question and the user has answered, display a see resutls button */}
      {isLastQuestion && question.userAnswer && (
        <button
          onClick={() => {
            props.handleResultsPressed();
          }}
        >
          {"Results"}
        </button>
      )}
    </div>
  );
}

export default QuestionForm;

// Form for user quiz detail selection such as difficulty and amount of questions
import React, { useEffect, useState } from "react";

function SetupForm(props) {
  // states to hold quiz details
  const [difficulty, setDifficulty] = useState("medium");
  const [amount, setAmount] = useState("10");
  // quiz detail options
  const difficulties = ["easy", "medium", "hard"];
  const amounts = ["5", "10", "15", "20", "25", "30"];

  return (
    <div>
      <div>
        {/* Select difficulty section: medium default */}
        <h2>Select Difficulty</h2>
        {difficulties.map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={difficulty === level ? "selected" : ""}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      {/* Select number of questions section: 10 default */}
      <div>
        <h2>Select Number of Questions</h2>
        {amounts.map((num) => (
          <button
            key={num}
            onClick={() => setAmount(num)}
            className={amount === num ? "selected" : ""}
          >
            {num}
          </button>
        ))}
      </div>

      <button onClick={() => props.handleStartPressed(amount, difficulty)}>
        Start Quiz
      </button>
    </div>
  );
}
export default SetupForm;

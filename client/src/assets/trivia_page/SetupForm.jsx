import React, { useEffect, useState } from "react";

function SetupForm(props) {
  const [difficulty, setDifficulty] = useState("medium");
  const [amount, setAmount] = useState("10");

  const difficulties = ["easy", "medium", "hard"];
  const amounts = ["5", "10", "15", "20", "25", "30"];

  return (
    <div>
      <div>
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

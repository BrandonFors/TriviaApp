// Displays a statistic on the stats page
import React from "react";

function StatsElement({ category }) {
  return (
    // create a stats element
    <div className="stats-element">
      <h3 className="category-title">{category.name}</h3>
      {category.items.map((item, index) => (
        // Display the difficulty and score of the quiz element
        <div key={index} className="stats-item">
          <p className="item-difficulty">{`${item.difficulty}:`}</p>
          <p className="item-score">{`Score: ${item.numCorrect}/${item.numQuestions}`}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsElement;

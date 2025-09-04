// buttons that allow user to choose a category
import React, { useEffect, useState } from "react";
function CategoryWidget(props) {
  // triggeres a function to choose a category when clicked
  const handleClick = (event) => {
    props.chooseCategory(props.category);
  };
  return (
    <button onClick={handleClick} className="button">
      {props.category}
    </button>
  );
}
export default CategoryWidget;

import React, { useEffect, useState } from "react";
function CategoryWidget(props){
    
    const handleClick = (event)=>{
        props.chooseCategory(props.category);
    }
    return(
        <button onClick={handleClick} className="button">{props.category}</button> 
    );
}
export default CategoryWidget;
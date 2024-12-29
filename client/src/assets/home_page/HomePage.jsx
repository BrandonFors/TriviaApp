import React, { useEffect, useState } from "react";
import "./HomePage.css";
import CategoryWidget from "./CategoryWidget";
import { useParams, useNavigate } from 'react-router-dom';

function HomePage(){
    const navigate = useNavigate();

    const categoryList = [
        "Random",
        "General Knowledge",
        "History",
        "Geography",
        "Sports"
    ]


    const chooseCategory = (category) => {
        // Pass data through URL or global state (e.g., Context)
        navigate(`/trivia/${category}`);
    };

    return(
        <div>
            <h1>Trivia</h1>
            <h2>Select A Category</h2>
            {categoryList.map((category, index) => {
            return (
            <CategoryWidget 
                key = {index}
                category={category} 
                chooseCategory = {chooseCategory}
                ></CategoryWidget>);
            })}
        </div>
    )

}
export default HomePage;
// a page do display the stats of the user's quizes 
import React, { useEffect, useState } from "react";
import axios from "axios";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useParams, useNavigate } from "react-router-dom";
import StatsElement from "./StatsElement";

function StatsPage() {
  // stores the categories that the user has taken quizzes of
  const [availCategories, setAvailCategories] = useState([]);
  // stores current category selected
  const [currentCategory, setCurrentCategory] = useState("");
  // stores the data of the current category selected
  const [categoryData, setCategoryData] = useState([]);
  // handles whether to navigate home
  const [navHome, setNavHome] = useState(false);
  const navigate = useNavigate();


  const handleChange = (event) => {
    setCurrentCategory(event.target.value);
  };

  // fetches the available categories from the backend for a given user
  useEffect(() => {
    const fetchAvailCategories = async () => {
      try{
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const response = await axios.get("http://localhost:8080/user/stats",{
          headers: { Authorization: `Bearer ${token}` },
          params: {username}
        });
        
        setAvailCategories(response.data);
        setCategoryData(response.data);
      }catch(error){
        console.log("Failed to get available categories")
      }
    };
    fetchAvailCategories();
  }, []);

  // fetches the data for the current category selected
  useEffect(() => {
    const fetchCategoryData = async () => {
      try{
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username")
        if(token){
          const response = await axios.get(
          "http://localhost:8080/user/stats/category",{
            headers: { Authorization: `Bearer ${token}`},
            params: {username, category:currentCategory}
          }
        );
        setCategoryData([response.data]);
        }
        
      }catch(error){
        console.log("Failed to fetch category data.")
      }
     
     
    };
    if (currentCategory !== "") {
      fetchCategoryData();
    }
  }, [currentCategory]);

  // navigates home if navHome is true
  useEffect(() => {
    if (navHome) {
      navigate("/");
    }
  }, [navHome]);

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>
          <LightbulbIcon fontSize="x-large" /> Profile Stats
        </h1>
        <button className="home-button" onClick={() => setNavHome(true)}>
          Home
        </button>
      </header>
      {/* a selection box for the user to select a catagory */}
      <div className="category-select">
        <h3>Select a Category</h3>
        <select
          value={currentCategory}
          onChange={handleChange}
          className="dropdown"
        >
          <option value="" disabled>
            -- Choose an option --
          </option>
          {/* use the catagories given to make a dropdown selection */}
          {availCategories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {/* displays the data for the selected category */}
      <div className="category-data">
        {categoryData.map((category, index) => (
          <StatsElement key={index} category={category} />
        ))}
      </div>
    </div>
  );
}

export default StatsPage;

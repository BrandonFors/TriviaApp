import React, { useEffect, useState } from "react";
import axios from "axios";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useParams, useNavigate } from "react-router-dom";
import StatsElement from "./StatsElement";

function StatsPage() {
  const [availCategories, setAvailCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [navHome, setNavHome] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCurrentCategory(event.target.value);
  };

  useEffect(() => {
    const fetchAvailCategories = async () => {
      const response = await axios.get("http://localhost:8080/stats");
      setAvailCategories(response.data);
    };
    fetchAvailCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const data = {
        category: currentCategory,
      };
      const response = await axios.post(
        "http://localhost:8080/stats/category",
        data
      );
      setCategoryData(response.data.categories);
    };
    if (currentCategory !== "") {
      fetchCategoryData();
    }
  }, [currentCategory]);

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
          {availCategories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="category-data">
        {categoryData.map((category, index) => (
          <StatsElement key={index} category={category} />
        ))}
      </div>
    </div>
  );
}

export default StatsPage;

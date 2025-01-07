import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryWidget from "./CategoryWidget";
import { useNavigate } from "react-router-dom";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();

  const categoryList = [
    "Random",
    "General Knowledge",
    "History",
    "Geography",
    "Sports",
    "Art",
    "Celebrities",
    "Entertainment: Video Games",
    "Entertainment: Music",
    "Entertainment: Film",
    "Entertainment: Comics",
  ];

  const chooseCategory = (category) => {
    // Pass data through URL or global state (e.g., Context)
    navigate(`/trivia/${category}`);
  };
  const handleUser = async () => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      const response = await axios.get("http://localhost:8080/logout");
      setLoggedIn(false);
      setCurrentUser("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/home");
        setLoggedIn(response.data.loggedIn);
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>
        <LightbulbIcon fontSize="large"></LightbulbIcon>Trivia
      </h1>
      <button onClick={handleUser}>
        {loggedIn ? `Sign Out: ${currentUser}` : "Login/SignUp"}
      </button>
      <div className="trivia-container">
        <h2>Select A Category</h2>
        <div className="button-container">
          {categoryList.map((category, index) => {
            return (
              <CategoryWidget
                key={index}
                category={category}
                chooseCategory={chooseCategory}
              ></CategoryWidget>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default HomePage;

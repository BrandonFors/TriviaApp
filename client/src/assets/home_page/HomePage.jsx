// homepage for the quiz site 
import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryWidget from "./CategoryWidget";
import { useNavigate } from "react-router-dom";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

function HomePage() {
  // stores whether or not a user is logged in
  const [loggedIn, setLoggedIn] = useState(false);
  // stores the name of the current user
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  // a list of available catagories
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
  // navigates to to a trivia setup page for a catagory
  const chooseCategory = (category) => {
    navigate(`/trivia/${category}`);
  };
  // if the login button is pressed and the user is not logged in, nav to the login page, otherwise logout
  const handleUser = async () => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      const response = await axios.get("http://localhost:8080/logout");
      setLoggedIn(false);
      setCurrentUser("");
    }
  };
  // nav to the stats page
  const handleStats = async () => {
    navigate(`/stats`);
  };

  // on load, fetch any user data present on the server to see if they are logged in
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
        <LightbulbIcon fontSize="x-large"></LightbulbIcon>Trivia
      </h1>
      {/* login/logout button */}
      <button onClick={handleUser}>
        {loggedIn ? `Sign Out: ${currentUser}` : "Login/SignUp"}
      </button>
      {/* if the user is logged in, make the stats button available */}
      {loggedIn && <button onClick={handleStats}>Profile Stats</button>}
      <div className="trivia-container">
      {/* section containing category buttons to select */}
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

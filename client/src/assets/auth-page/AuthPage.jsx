// page where the user can login
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  // stores whether or not the form should be a signup or login
  const [isSignup, setIsSignup] = useState(false);
  // stores the form data entered 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  // stores an error message returned by the backend
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [navHome, setNavHome] = useState(false);
  const navigate = useNavigate();

  // handles change in any fields of the form data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // handles submitting form data to the backend to login or sign up
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (isSignup && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isSignup ? "/signup" : "/login";
      const postData = {
        username: formData.username,
        password: formData.password,
      };
      const response = await axios.post(
        `http://localhost:8080${endpoint}`,
        postData
      );
      if (!response.data.success) {
        setErrorMessage(response.data.message);
      }
      if (!isSignup && response.data.success) {
        setNavHome(true);
      }

      setFormData({ username: "", password: "", confirmPassword: "" });
      setIsSignup(false);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navHome) {
      navigate("/");
    }
  }, [navHome]);

  return (
    <div className="auth-container">
      <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
      {/* form for login or signup */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          {/* username section */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        {/* password section */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* if the form is for signup, include a password confirmation section */}
        {isSignup && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {/* display an error message if one is present */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {/* submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p>
        {/* Displays an option to toggle between signup and login */}
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="toggle-button"
          onClick={() => setIsSignup((prevValue) => !prevValue)}
          disabled={loading}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
        Want to go back?
        {/* go back to homepage */}
        <button
          className="toggle-button"
          onClick={() => setNavHome(true)}
          disabled={loading}
        >
          Home
        </button>
      </p>
    </div>
  );
}

export default AuthPage;

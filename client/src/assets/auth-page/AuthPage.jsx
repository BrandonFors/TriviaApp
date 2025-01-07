import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [navHome, setNavHome] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      if(!response.data.success){
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

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmfor="username">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlfor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {isSignup && (
          <div className="form-group">
            <label htmlfor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="toggle-button"
          onClick={() => setIsSignup((prev) => !prev)}
          disabled={loading}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

export default AuthPage;

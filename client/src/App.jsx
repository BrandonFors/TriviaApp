import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./assets/footer/Footer";
import TriviaPage from "./assets/trivia_page/TriviaPage";
import HomePage from "./assets/home_page/HomePage";
import AuthPage from "./assets/auth-page/AuthPage";
import StatsPage from "./assets/profile_page/StatsPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/trivia/:category" element={<TriviaPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Router>
      <Footer></Footer>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SentimentPage from "./pages/SentimentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<HomePage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
